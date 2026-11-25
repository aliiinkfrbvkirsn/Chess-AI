(() => {
  const $ = id => document.getElementById(id);
  if (typeof Chess === "undefined") { $("status").textContent = "Нет подключения"; $("hint").textContent = "Для работы правил шахмат нужен интернет: библиотека chess.js загружается с CDN."; return; }
  const game = new Chess();
  const boardEl = $("board");
  // Silhouettes traced from the user's Chess.com reference screenshot.
  const piecePaths = {
    wp:["M55.1,28.3 L49.1,32.7 L44.7,41.7 L47.6,58 L43.2,61 L43.2,70 L44.7,72.9 L50.6,74.4 L50.6,78.9 L32.7,96.7 L29.8,102.7 L29.8,116.1 L96.7,116.1 L98.2,114.6 L96.7,99.7 L77.4,80.4 L77.4,74.4 L83.3,72.9 L86.3,64 L80.4,58 L83.3,46.1 L81.9,37.2 L75.9,29.8 L70,26.8Z"],
    wn:["M47.1,11.8 L44.1,22.1 L33.8,32.4 L29.4,45.6 L17.7,63.3 L17.7,67.7 L23.5,73.6 L30.9,76.5 L39.7,75 L45.6,67.7 L51.5,69.1 L51.5,72.1 L41.2,83.9 L38.3,91.2 L29.4,98.6 L29.4,113.3 L30.9,114.8 L104.5,114.8 L105.9,103 L103,95.6 L98.6,92.7 L98.6,83.9 L101.5,75 L101.5,57.4 L95.6,41.2 L79.4,25 L60.3,19.1 L54.4,11.8Z"],
    wb:["M59.5,8.8 L52.1,13.2 L50.6,28 L38.7,39.7 L34.2,47.1 L31.3,55.9 L31.3,73.6 L37.2,89.7 L25.3,97.1 L23.8,111.8 L26.8,114.8 L99.7,114.8 L101.2,103 L98.2,95.6 L86.3,89.7 L93.8,72.1 L92.3,53 L89.3,45.6 L77.4,30.9 L74.4,29.4 L71.4,30.9 L70,36.8 L65.5,35.3 L65.5,30.9 L68.5,29.4 L72.9,20.6 L72.9,16.2 L67,10.3Z","M61,53 L65.5,54.4 L64,61.8 L59.5,60.3Z","M64,39.7 L68.5,41.2 L65.5,53 L61,51.5 L61,44.1Z"],
    wr:["M31.3,23.5 L28.3,26.5 L29.8,30.9 L28.3,41.2 L34.2,51.5 L37.2,53 L37.2,70.6 L34.2,88.3 L23.8,100 L23.8,113.3 L25.3,114.8 L99.7,114.8 L101.2,103 L99.7,97.1 L89.3,86.8 L86.3,53 L92.3,48.6 L95.3,41.2 L95.3,25 L83.3,20.6 L74.4,23.5 L72.9,20.6 L62.5,17.7 L52.1,20.6 L50.6,25 L47.6,25 L43.2,20.6Z"],
    wq:["M41.2,13.2 L36.8,19.1 L36.8,29.4 L41.2,33.8 L39.7,41.2 L36.8,41.2 L32.4,33.8 L25,30.9 L16.2,33.8 L11.8,41.2 L11.8,47.1 L23.5,60.3 L33.8,86.8 L33.8,91.2 L28,95.6 L25,101.5 L25,113.3 L26.5,114.8 L100,114.8 L101.5,101.5 L100,97.1 L92.7,91.2 L92.7,86.8 L104.5,57.4 L114.8,47.1 L114.8,41.2 L111.8,35.3 L103,30.9 L97.1,32.4 L91.2,38.3 L89.7,50 L85.3,51.5 L83.9,50 L83.9,35.3 L91.2,26.5 L91.2,20.6 L85.3,13.2 L72.1,11.8 L64.7,20.6 L61.8,20.6 L54.4,11.8Z","M61.8,28 L64.7,28 L67.7,32.4 L64.7,41.2 L61.8,41.2 L58.9,35.3 L58.9,30.9Z"],
    wk:["M70,7.4 L55.1,8.8 L53.6,14.7 L46.1,19.1 L44.7,33.8 L26.8,35.3 L14.9,47.1 L11.9,58.9 L13.4,67.7 L20.8,79.4 L31.3,89.7 L31.3,92.7 L25.3,100 L26.8,114.8 L99.7,114.8 L101.2,113.3 L101.2,101.5 L95.3,92.7 L95.3,88.3 L110.1,72.1 L114.6,60.3 L113.1,53 L107.2,41.2 L98.2,35.3 L80.4,32.4 L80.4,19.1 L71.4,14.7Z","M86.3,57.4 L87.8,63.3 L78.9,73.6 L75.9,73.6 L74.4,60.3 L77.4,57.4Z","M38.7,57.4 L44.7,55.9 L50.6,60.3 L49.1,70.6 L44.7,70.6 L37.2,61.8Z"],
    bp:["M52.1,31.3 L46.1,40.2 L47.6,59.5 L43.2,64 L43.2,70 L44.7,72.9 L50.6,74.4 L50.6,80.4 L32.7,98.2 L29.8,105.7 L29.8,116.1 L96.7,116.1 L98.2,105.7 L95.3,98.2 L77.4,81.9 L77.4,75.9 L83.3,72.9 L84.8,70 L84.8,64 L78.9,59.5 L81.9,52.1 L81.9,40.2 L74.4,29.8 L65.5,26.8Z"],
    bn:["M48.6,13.2 L44.1,19.1 L44.1,23.5 L36.8,29.4 L30.9,45.6 L19.1,61.8 L19.1,70.6 L28,76.5 L36.8,78 L45.6,69.1 L53,70.6 L53,73.6 L45.6,79.4 L39.7,91.2 L30.9,98.6 L29.4,104.5 L30.9,116.2 L103,116.2 L104.5,114.8 L104.5,100 L97.1,92.7 L101.5,73.6 L101.5,61.8 L95.6,42.7 L85.3,30.9 L75,25 L61.8,22.1 L53,13.2Z"],
    bb:["M55.1,11.8 L50.6,16.2 L50.6,28 L34.2,47.1 L34.2,51.5 L31.3,55.9 L29.8,69.1 L35.7,91.2 L26.8,95.6 L23.8,101.5 L23.8,114.8 L25.3,116.2 L101.2,116.2 L101.2,101.5 L95.3,94.2 L87.8,91.2 L95.3,67.7 L93.8,55.9 L89.3,45.6 L86.3,44.1 L77.4,30.9 L70,29.4 L72.9,23.5 L71.4,14.7 L65.5,10.3Z"],
    br:["M32.7,25 L29.8,29.4 L32.7,48.6 L40.2,55.9 L35.7,91.2 L26.8,98.6 L25.3,116.2 L101.2,116.2 L102.7,101.5 L92.3,91.2 L87.8,55.9 L96.7,45.6 L95.3,44.1 L96.7,26.5 L87.8,22.1 L81.9,22.1 L75.9,25 L72.9,20.6 L55.1,20.6 L52.1,28 L49.1,28 L46.1,22.1Z"],
    bq:["M39.7,16.2 L36.8,20.6 L36.8,29.4 L42.7,36.8 L41.2,45.6 L38.3,45.6 L35.3,39.7 L28,33.8 L20.6,33.8 L13.2,39.7 L13.2,50 L22.1,58.9 L33.8,86.8 L33.8,92.7 L28,97.1 L25,104.5 L26.5,116.2 L100,116.2 L100,100 L97.1,95.6 L91.2,92.7 L91.2,89.7 L98.6,75 L100,67.7 L103,64.7 L103,60.3 L113.3,50 L114.8,44.1 L111.8,38.3 L105.9,33.8 L95.6,35.3 L91.2,39.7 L91.2,50 L85.3,53 L83.9,51.5 L83.9,36.8 L88.3,33.8 L91.2,26.5 L86.8,16.2 L82.4,13.2 L73.6,13.2 L67.7,17.7 L64.7,25 L61.8,25 L58.9,17.7 L53,13.2 L45.6,13.2Z","M35.3,47.1 L41.2,45.6 L42.7,50 L36.8,51.5Z","M61.8,28 L64.7,28 L67.7,32.4 L67.7,39.7 L64.7,44.1 L61.8,44.1 L58.9,38.3 L58.9,32.4Z"],
    bk:["M55.1,8.8 L53.6,14.7 L44.7,19.1 L46.1,33.8 L44.7,35.3 L35.7,33.8 L31.3,36.8 L26.8,36.8 L17.9,42.7 L13.4,50 L11.9,57.4 L13.4,70.6 L17.9,78 L29.8,89.7 L29.8,94.2 L25.3,98.6 L23.8,116.2 L101.2,116.2 L102.7,111.8 L101.2,101.5 L98.2,95.6 L95.3,94.2 L95.3,89.7 L104.2,82.4 L114.6,64.7 L113.1,51.5 L104.2,39.7 L93.8,36.8 L90.8,33.8 L81.9,35.3 L80.4,33.8 L80.4,17.7 L72.9,17.7 L70,8.8Z","M86.3,58.9 L87.8,63.3 L81.9,70.6 L77.4,70.6 L75.9,61.8 L80.4,57.4Z","M41.7,57.4 L50.6,61.8 L49.1,72.1 L46.1,72.1 L40.2,66.2Z"]
  };
  function pieceMarkup(piece){
    const white=piece.color==="w";
    const fill=white?"#f7f7f2":"#625f66";
    const stroke=white?"#343338":"#29282d";
    const paths=piecePaths[piece.color+piece.type]||[];
    return '<svg class="piece-glyph piece-'+(white?"white":"black")+'" viewBox="0 0 128 128" aria-hidden="true" focusable="false"><g fill="'+fill+'" stroke="'+stroke+'" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round" fill-rule="evenodd" style="filter:drop-shadow(0 1.2px 1px #17171766)">'+paths.map(d=>'<path d="'+d+'"/>').join("")+'</g></svg>';
  }
  const values = {p:100,n:320,b:330,r:500,q:900,k:20000};
  const key = "chess_ai_memory_v1";
  let memory = loadMemory(), selected = null, legal = [], lastMove = null, thinking = false;
  function loadMemory(){const empty={games:0,aiWins:0,playerWins:0,draws:0,positions:{},preferred:{},tactics:{checks:0,captures:0,castles:0,promotions:0}};try{const old=JSON.parse(localStorage.getItem(key))||{};return {...empty,...old,tactics:{...empty.tactics,...(old.tactics||{})}}}catch(e){return empty}}
  function save(){try{localStorage.setItem(key,JSON.stringify(memory))}catch(e){} updateStats()}
  function updateStats(){ $("games").textContent=memory.games; $("aiWins").textContent=memory.aiWins; $("playerWins").textContent=memory.playerWins; $("memory").textContent=Object.keys(memory.positions).length; }
  const captureValues={p:1,n:3,b:3,r:5,q:9};
  function updateCapturedPieces(){
    const whiteCaptured=[],blackCaptured=[];
    let whitePoints=0,blackPoints=0;
    game.history({verbose:true}).forEach(move=>{
      if(!move.captured)return;
      const captured={type:move.captured,color:move.color==="w"?"b":"w"};
      const points=captureValues[move.captured]||0;
      if(move.color==="w"){whiteCaptured.push(captured);whitePoints+=points}
      else{blackCaptured.push(captured);blackPoints+=points}
    });
    const drawTray=(id,pieces)=>{
      const el=$(id);if(!el)return;
      el.innerHTML=pieces.map(piece=>pieceMarkup(piece)).join("");
      el.setAttribute("aria-label",pieces.length?"Съедено фигур: "+pieces.length:"Пока ничего не съедено");
    };
    drawTray("youCaptured",whiteCaptured);
    drawTray("aiCaptured",blackCaptured);
    const advantage=whitePoints-blackPoints;
    $("youAdvantage").textContent=advantage>0?"+"+advantage:"";
    $("aiAdvantage").textContent=advantage<0?"+"+Math.abs(advantage):"";
  }
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
      if(p){el.insertAdjacentHTML("beforeend",pieceMarkup(p));}
      el.setAttribute("aria-label",sq+(p?", "+p.type:""));
    }
    const history=game.history();
    $("moves").innerHTML="";
    if(!history.length){const li=document.createElement("li");li.className="empty";li.textContent="Партия ещё не началась";$("moves").append(li)}
    history.forEach((m,i)=>{if(i%2===0){const li=document.createElement("li");li.textContent=(Math.floor(i/2)+1)+". "+m;$("moves").append(li)}else{$("moves").lastChild.textContent+="   "+m}});
    $("moves").scrollTop=$("moves").scrollHeight;
    updateCapturedPieces();
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
  function animateCastlingRook(move){
    if(!move||!move.flags)return;
    const rank=move.color==="w"?"1":"8";
    if(move.flags.includes("k"))animateMove("h"+rank,"f"+rank,{color:move.color,type:"r"});
    else if(move.flags.includes("q"))animateMove("a"+rank,"d"+rank,{color:move.color,type:"r"});
  }
  function animateMove(from,to,piece){
    const fromEl=boardEl.querySelector('[data-square="'+from+'"]');
    if(!fromEl||!piece)return;
    const original=fromEl.querySelector(".piece-glyph");
    if(!original)return;
    const startRect=original.getBoundingClientRect();

    // A separate fixed overlay keeps the moving piece visible while render()
    // updates the board underneath it.
    const flight=document.createElement("div");
    flight.className="piece-flight-layer";
    flight.style.left=startRect.left+"px";
    flight.style.top=startRect.top+"px";
    flight.style.width=startRect.width+"px";
    flight.style.height=startRect.height+"px";
    const glyphEl=original.cloneNode(true);
    glyphEl.classList.remove("piece-flight");
    flight.appendChild(glyphEl);
    document.body.appendChild(flight);

    requestAnimationFrame(()=>{
      const destination=boardEl.querySelector('[data-square="'+to+'"]');
      if(!destination||!flight.isConnected){flight.remove();return}
      const targetRect=destination.getBoundingClientRect();
      const targetPiece=destination.querySelector(".piece-glyph");
      const dx=(targetRect.left+targetRect.width/2)-(startRect.left+startRect.width/2);
      const dy=(targetRect.top+targetRect.height/2)-(startRect.top+startRect.height/2);

      if(targetPiece)targetPiece.style.opacity="0";
      const cleanup=()=>{
        flight.remove();
        const current=boardEl.querySelector('[data-square="'+to+'"] .piece-glyph');
        if(current){current.style.opacity="";current.style.visibility=""}
      };

      // Start on the next paint so the browser has committed the start position.
      requestAnimationFrame(()=>{
        if(typeof flight.animate==="function"){
          const anim=flight.animate(
            [{transform:"translate3d(0,0,0)"},{transform:"translate3d("+dx+"px,"+dy+"px,0)"}],
            {duration:650,easing:"cubic-bezier(.22,.61,.36,1)",fill:"forwards"}
          );
          anim.onfinish=cleanup;
          anim.oncancel=cleanup;
        }else{
          flight.style.transition="transform 650ms cubic-bezier(.22,.61,.36,1)";
          requestAnimationFrame(()=>{flight.style.transform="translate3d("+dx+"px,"+dy+"px,0)"});
          setTimeout(cleanup,700);
        }
      });
    });
  }
  function tap(sq){
    if(thinking||game.turn()!=="w"||game.game_over())return;
    const p=game.get(sq);
    if(selected&&legal.includes(sq)){
      const move=game.move({from:selected,to:sq,promotion:"q"});
      if(move){lastMove=move;selected=null;legal=[];animateMove(move.from,move.to,move.piece);animateCastlingRook(move);afterPlayerMove(move);return}
    }
    if(p&&p.color==="w"){selected=sq;legal=game.moves({square:sq, verbose:true}).map(m=>m.to)}
    else{selected=null;legal=[]}
    render();
  }
  function afterPlayerMove(move){learnFromPlayer(move);recordPosition();render();if(finishIfOver())return;thinking=true;setTimeout(aiMove,180)}
  function finishIfOver(){
    if(!game.game_over())return false;
    memory.games++;
    if(game.in_checkmate()){if(game.turn()==="w")memory.aiWins++;else memory.playerWins++}else memory.draws++;
    save();render();return true;
  }
  function recordPosition(){const fen=game.fen().split(" ").slice(0,4).join(" ");memory.positions[fen]=(memory.positions[fen]||0)+1}
  function learnFromPlayer(move){if(!move)return;const t=memory.tactics||(memory.tactics={checks:0,captures:0,castles:0,promotions:0});if(move.captured)t.captures++;if(game.in_check())t.checks++;if(move.flags&&(move.flags.includes("k")||move.flags.includes("q")))t.castles++;if(move.promotion)t.promotions++;save()}
  function evaluate(){
    if(game.in_checkmate())return game.turn()==="w"?100000:-100000;
    if(game.in_draw())return 0;
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
      const habits=memory.tactics||{checks:0,captures:0,castles:0,promotions:0};
      if(game.in_check())score+=Math.min(habits.checks,20)*([0.3,0.5,0.8,1][level-1]);
      if(m.captured)score+=Math.min(habits.captures,20)*([0.2,0.4,0.7,1][level-1]);
      if(m.flags&&(m.flags.includes("k")||m.flags.includes("q")))score+=Math.min(habits.castles,10)*([0.2,0.3,0.5,0.7][level-1]);
      const pref=memory.preferred[m.from+m.to]||0;score+=pref*([0.2,0.4,0.6,1][level-1]);
      if(score>best){best=score;choices=[m]}else if(score===best)choices.push(m);
    }
    const chosen=choices[Math.floor(Math.random()*choices.length)];
    if(chosen){const played=game.move({from:chosen.from,to:chosen.to,promotion:"q"});lastMove=chosen;animateMove(chosen.from,chosen.to,chosen);animateCastlingRook(played);memory.preferred[chosen.from+chosen.to]=(memory.preferred[chosen.from+chosen.to]||0)+1}
    thinking=false;recordPosition();render();finishIfOver();
  }
  $("newGame").addEventListener("click",()=>{if(game.history().length&&!game.game_over()){memory.games++;memory.draws++;save()}game.reset();selected=null;legal=[];lastMove=null;thinking=false;render()});
  $("undo").addEventListener("click",()=>{if(thinking)return;if(game.history().length){game.undo();if(game.turn()==="b"&&game.history().length)game.undo();selected=null;legal=[];lastMove=null;render()}});
  $("level").addEventListener("change",()=>{$("aiLabel").textContent="Уровень: "+$("level").selectedOptions[0].textContent});
  updateStats();render();
})();