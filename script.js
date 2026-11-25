(() => {
  const $ = id => document.getElementById(id);
  if (typeof Chess === "undefined") { $("status").textContent = "Нет подключения"; $("hint").textContent = "Для работы правил шахмат нужен интернет: библиотека chess.js загружается с CDN."; return; }
  const game = new Chess();
  const boardEl = $("board");
  const glyph = {wp:"♟",wn:"♞",wb:"♝",wr:"♜",wq:"♛",wk:"♚",bp:"♟",bn:"♞",bb:"♝",br:"♜",bq:"♛",bk:"♚"};
  const values = {p:100,n:320,b:330,r:500,q:900,k:20000};
  const key = "chess_ai_memory_v1";
  let memory = loadMemory(), selected = null, legal = [], lastMove = null, thinking = false;
  function loadMemory(){try{return JSON.parse(localStorage.getItem(key))||{games:0,aiWins:0,playerWins:0,draws:0,positions:{},preferred:{}}}catch(e){return {games:0,aiWins:0,playerWins:0,draws:0,positions:{},preferred:{}}}}
  function save(){try{localStorage.setItem(key,JSON.stringify(memory))}catch(e){} updateStats()}
  function updateStats(){ $("games").textContent=memory.games; $("aiWins").textContent=memory.aiWins; $("playerWins").textContent=memory.playerWins; $("memory").textContent=Object.keys(memory.positions).length; }
  function render(){
    let table=boardEl.querySelector(".chess-table");
    if(!table){
      let markup='<table class="chess-table" aria-label="Шахматная доска"><tbody>';
      for(let r=0;r<8;r++){
        markup+='<tr>';
        for(let c=0;c<8;c++){
          const sq="abcdefgh"[c]+(8-r);
          markup+='<td><button type="button" class="square" data-square="'+sq+'" aria-label="'+sq+'"></button></td>';
        }
        markup+='</tr>';
      }
      markup+='</tbody></table>';
      boardEl.innerHTML=markup;
      table=boardEl.querySelector(".chess-table");
    }
    for(let r=0;r<8;r++)for(let c=0;c<8;c++){
      const sq="abcdefgh"[c]+(8-r), p=game.get(sq);
      const el=table.rows[r].cells[c].firstElementChild;
      el.className="square "+((r+c)%2?"dark":"light");
      if(selected===sq)el.classList.add("selected");
      if(legal.includes(sq)){el.classList.add("legal");if(p)el.classList.add("capture");}
      if(lastMove&&(lastMove.from===sq||lastMove.to===sq))el.classList.add("last");
      el.replaceChildren();
      if(p){const pieceEl=document.createElement("span");pieceEl.className="piece-glyph "+(p.color==="w"?"piece-white":"piece-black");pieceEl.textContent=glyph[p.color+p.type];el.appendChild(pieceEl);}
      el.setAttribute("aria-label",sq+(p?", "+p.type:""));
    }
    const history=game.history();
    $("moves").innerHTML="";
    if(!history.length){const li=document.createElement("li");li.className="empty";li.textContent="Партия ещё не началась";$("moves").append(li)}
    history.forEach((m,i)=>{if(i%2===0){const li=document.createElement("li");li.textContent=(Math.floor(i/2)+1)+". "+m;$("moves").append(li)}else{$("moves").lastChild.textContent+="   "+m}});
    $("moves").scrollTop=$("moves").scrollHeight;
    updateStatus();
  }
  boardEl.addEventListener("click",event=>{
    const cell=event.target.closest("button[data-square]");
    if(cell)tap(cell.dataset.square);
  });
  function updateStatus(){
    const over=game.game_over();
    $("aiTurn").classList.toggle("active",game.turn()==="b"&&!over);
    $("youTurn").classList.toggle("active",game.turn()==="w"&&!over);
    if(game.in_checkmate()){$("status").textContent=game.turn()==="w"?"Мат — победил ИИ":"Мат — ты победил";$("hint").textContent="Партия завершена. Начни новую игру."}
    else if(game.in_draw()){$("status").textContent="Ничья";$("hint").textContent="Партия завершена."}
    else if(game.in_check()){$("status").textContent="Шах!";$("hint").textContent=game.turn()==="w"?"Тебе нужно защитить короля.":"ИИ должен ответить на шах."}
    else{$("status").textContent=game.turn()==="w"?"Твой ход":"ИИ думает";$("hint").textContent=game.turn()==="w"?"Выбери фигуру, затем клетку для хода.":"Подбираю лучший ход…"}
  }
  function animateMove(from,to,piece){
    const fromEl=boardEl.querySelector('[data-square="'+from+'"]');
    const toEl=boardEl.querySelector('[data-square="'+to+'"]');
    if(!fromEl||!toEl||!piece)return;
    const a=fromEl.getBoundingClientRect();
    const b=toEl.getBoundingClientRect();
    const ghost=document.createElement("div");
    const fromStyle=getComputedStyle(fromEl);
    ghost.className="moving-piece";
    const pieceEl=document.createElement("span");
    pieceEl.className="piece-glyph "+(piece.color==="w"?"piece-white":"piece-black");
    pieceEl.textContent=glyph[piece.color+piece.type];
    ghost.appendChild(pieceEl);
    ghost.style.left=a.left+"px";
    ghost.style.top=a.top+"px";
    ghost.style.width=a.width+"px";
    ghost.style.height=a.height+"px";
    ghost.style.fontSize=fromStyle.fontSize;
    ghost.style.color=fromStyle.color;
    ghost.style.transform="translate3d(0,0,0)";
    document.body.appendChild(ghost);

    // Hide the destination piece while the moving copy travels over the board.
    toEl.style.visibility="hidden";
    const dx=b.left-a.left;
    const dy=b.top-a.top;
    let finished=false;
    const finish=()=>{
      if(finished)return;
      finished=true;
      ghost.remove();
      const destination=boardEl.querySelector('[data-square="'+to+'"]');
      if(destination)destination.style.visibility="";
    };

    // Wait for the browser to paint the piece at its real starting position.
    requestAnimationFrame(()=>{
      requestAnimationFrame(()=>{
        if(!ghost.isConnected){finish();return}
        if(typeof ghost.animate==="function"){
          const animation=ghost.animate(
            [
              {transform:"translate3d(0px,0px,0)",offset:0},
              {transform:"translate3d("+dx+"px,"+dy+"px,0)",offset:1}
            ],
            {duration:520,easing:"cubic-bezier(.18,.72,.22,1)",fill:"forwards"}
          );
          animation.onfinish=finish;
          animation.oncancel=finish;
        }else{
          ghost.style.transition="transform 520ms cubic-bezier(.18,.72,.22,1)";
          requestAnimationFrame(()=>{ghost.style.transform="translate3d("+dx+"px,"+dy+"px,0)"});
          setTimeout(finish,560);
        }
      });
    });
  }
  function tap(sq){
    if(thinking||game.turn()!=="w"||game.game_over())return;
    const p=game.get(sq);
    if(selected&&legal.includes(sq)){
      const move=game.move({from:selected,to:sq,promotion:"q"});
      if(move){lastMove=move;selected=null;legal=[];animateMove(move.from,move.to,move.piece);afterPlayerMove();return}
    }
    if(p&&p.color==="w"){selected=sq;legal=game.moves({square:sq, verbose:true}).map(m=>m.to)}
    else{selected=null;legal=[]}
    render();
  }
  function afterPlayerMove(){recordPosition();render();if(finishIfOver())return;thinking=true;setTimeout(aiMove,180)}
  function finishIfOver(){
    if(!game.game_over())return false;
    memory.games++;
    if(game.in_checkmate()){if(game.turn()==="w")memory.aiWins++;else memory.playerWins++}else memory.draws++;
    save();render();return true;
  }
  function recordPosition(){const fen=game.fen().split(" ").slice(0,4).join(" ");memory.positions[fen]=(memory.positions[fen]||0)+1}
  function evaluate(){
    let score=0;
    for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=game.board()[r][c];if(!p)continue;let v=values[p.type];if(p.type==="p")v+=(p.color==="w"?6-r:r-1)*5;if(p.type==="n"||p.type==="b")v+=(3.5-Math.abs(3.5-c)+3.5-Math.abs(3.5-r))*5;score+=(p.color==="b"?v:-v)}
    return score;
  }
  function minimax(depth,alpha,beta,maximizing){
    if(depth===0||game.game_over())return evaluate();
    const moves=game.moves({verbose:true});
    if(maximizing){let best=-Infinity;for(const m of moves){game.move(m);best=Math.max(best,minimax(depth-1,alpha,beta,false));game.undo();alpha=Math.max(alpha,best);if(beta<=alpha)break}return best}
    let best=Infinity;for(const m of moves){game.move(m);best=Math.min(best,minimax(depth-1,alpha,beta,true));game.undo();beta=Math.min(beta,best);if(beta<=alpha)break}return best;
  }
  function aiMove(){
    if(game.game_over()){thinking=false;finishIfOver();return}
    const level=Number($("level").value), depth=[1,2,2,3][level-1];
    const moves=game.moves({verbose:true});let best=-Infinity,choices=[];
    for(const m of moves){
      game.move(m);let score=minimax(depth-1,-Infinity,Infinity,false);game.undo();
      const fen=game.fen().split(" ").slice(0,4).join(" ");
      const learned=memory.positions[fen]||0;
      score+=Math.random()*([45,20,8,2][level-1]);
      score-=Math.min(learned,5)*([2,4,8,12][level-1]);
      const pref=memory.preferred[m.from+m.to]||0;score+=pref*([1,2,3,5][level-1]);
      if(score>best){best=score;choices=[m]}else if(score===best)choices.push(m);
    }
    const chosen=choices[Math.floor(Math.random()*choices.length)];
    if(chosen){game.move({from:chosen.from,to:chosen.to,promotion:"q"});lastMove=chosen;animateMove(chosen.from,chosen.to,chosen);memory.preferred[chosen.from+chosen.to]=(memory.preferred[chosen.from+chosen.to]||0)+1}
    thinking=false;recordPosition();render();finishIfOver();
  }
  $("newGame").addEventListener("click",()=>{if(game.history().length&&!game.game_over()){memory.games++;memory.draws++;save()}game.reset();selected=null;legal=[];lastMove=null;thinking=false;render()});
  $("undo").addEventListener("click",()=>{if(thinking)return;if(game.history().length){game.undo();if(game.turn()==="b"&&game.history().length)game.undo();selected=null;legal=[];lastMove=null;render()}});
  $("level").addEventListener("change",()=>{$("aiLabel").textContent="Уровень: "+$("level").selectedOptions[0].textContent});
  updateStats();render();
})();