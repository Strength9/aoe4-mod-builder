/* eslint-disable */
import { useState, useCallback, useRef, useEffect, useMemo } from "react";

const UNITS = [
  { id:"spearman",    name:"Spearman",        icon:"🪖", cat:"infantry", hp:95,   atk:8,   aspd:1.5,  range:0,  armor:1, spd:1.12, trainTime:22, trainCostF:60,  trainCostG:0   },
  { id:"maa",         name:"Man-at-Arms",     icon:"🛡️", cat:"infantry", hp:130,  atk:14,  aspd:1.8,  range:0,  armor:3, spd:1.00, trainTime:30, trainCostF:100, trainCostG:20  },
  { id:"hswdsman",    name:"Heavy Swordsman", icon:"⚔️", cat:"infantry", hp:170,  atk:18,  aspd:1.75, range:0,  armor:4, spd:1.00, trainTime:35, trainCostF:120, trainCostG:30  },
  { id:"pikeman",     name:"Pikeman",         icon:"🔱", cat:"infantry", hp:110,  atk:10,  aspd:1.5,  range:0,  armor:2, spd:1.00, trainTime:25, trainCostF:80,  trainCostG:0   },
  { id:"monk",        name:"Monk",            icon:"📿", cat:"infantry", hp:65,   atk:0,   aspd:0,    range:5,  armor:0, spd:1.12, trainTime:45, trainCostF:0,   trainCostG:100 },
  { id:"villager",    name:"Villager",        icon:"🧑‍🌾",cat:"infantry", hp:70,   atk:5,   aspd:2.0,  range:0,  armor:0, spd:1.12, trainTime:20, trainCostF:50,  trainCostG:0   },
  { id:"horseman",    name:"Horseman",        icon:"🐴", cat:"cavalry",  hp:115,  atk:10,  aspd:1.5,  range:0,  armor:2, spd:1.75, trainTime:28, trainCostF:100, trainCostG:20  },
  { id:"knight",      name:"Knight",          icon:"🏇", cat:"cavalry",  hp:175,  atk:18,  aspd:1.8,  range:0,  armor:4, spd:1.62, trainTime:40, trainCostF:140, trainCostG:60  },
  { id:"lancer",      name:"Lancer",          icon:"⚡", cat:"cavalry",  hp:155,  atk:22,  aspd:2.0,  range:0,  armor:3, spd:1.75, trainTime:38, trainCostF:130, trainCostG:50  },
  { id:"scout",       name:"Scout",           icon:"🔭", cat:"cavalry",  hp:100,  atk:6,   aspd:1.5,  range:0,  armor:0, spd:2.00, trainTime:18, trainCostF:80,  trainCostG:0   },
  { id:"camelrider",  name:"Camel Rider",     icon:"🐪", cat:"cavalry",  hp:160,  atk:14,  aspd:1.75, range:0,  armor:2, spd:1.62, trainTime:36, trainCostF:120, trainCostG:40  },
  { id:"warelephant", name:"War Elephant",    icon:"🐘", cat:"cavalry",  hp:600,  atk:35,  aspd:2.5,  range:0,  armor:6, spd:1.00, trainTime:90, trainCostF:300, trainCostG:200 },
  { id:"archer",      name:"Archer",          icon:"🏹", cat:"ranged",   hp:70,   atk:7,   aspd:1.25, range:5,  armor:0, spd:1.12, trainTime:22, trainCostF:60,  trainCostG:0   },
  { id:"crossbow",    name:"Crossbowman",     icon:"🎯", cat:"ranged",   hp:85,   atk:12,  aspd:2.0,  range:5,  armor:1, spd:1.00, trainTime:30, trainCostF:80,  trainCostG:40  },
  { id:"handcan",     name:"Handcannoneer",   icon:"💥", cat:"ranged",   hp:80,   atk:35,  aspd:4.0,  range:5,  armor:1, spd:1.00, trainTime:45, trainCostF:120, trainCostG:60  },
  { id:"grenadier",   name:"Grenadier",       icon:"💣", cat:"ranged",   hp:90,   atk:28,  aspd:3.5,  range:4,  armor:1, spd:1.00, trainTime:40, trainCostF:100, trainCostG:50  },
  { id:"cavarcher",   name:"Cavalry Archer",  icon:"🎠", cat:"ranged",   hp:100,  atk:9,   aspd:1.5,  range:4,  armor:1, spd:1.62, trainTime:35, trainCostF:110, trainCostG:30  },
  { id:"mango",       name:"Mangonel",        icon:"🗿", cat:"siege",    hp:240,  atk:80,  aspd:5.0,  range:9,  armor:0, spd:0.87, trainTime:60, trainCostF:0,   trainCostG:300 },
  { id:"trebuchet",   name:"Trebuchet",       icon:"🏹", cat:"siege",    hp:190,  atk:200, aspd:10,   range:15, armor:0, spd:0.75, trainTime:90, trainCostF:0,   trainCostG:500 },
  { id:"ram",         name:"Battering Ram",   icon:"🪵", cat:"siege",    hp:400,  atk:600, aspd:10,   range:0,  armor:5, spd:0.75, trainTime:60, trainCostF:0,   trainCostG:250 },
  { id:"springald",   name:"Springald",       icon:"⚙️", cat:"siege",    hp:190,  atk:30,  aspd:5.0,  range:10, armor:0, spd:0.87, trainTime:60, trainCostF:0,   trainCostG:250 },
  { id:"ribauldequin",name:"Ribauldequin",    icon:"🔫", cat:"siege",    hp:160,  atk:16,  aspd:2.0,  range:6,  armor:0, spd:0.75, trainTime:60, trainCostF:0,   trainCostG:300 },
  { id:"bombard",     name:"Bombard",         icon:"💨", cat:"siege",    hp:220,  atk:280, aspd:15,   range:12, armor:0, spd:0.62, trainTime:120,trainCostF:0,   trainCostG:600 },
  { id:"galley",      name:"Galley",          icon:"⚓", cat:"naval",    hp:350,  atk:25,  aspd:2.0,  range:7,  armor:1, spd:1.50, trainTime:30, trainCostF:0,   trainCostG:150 },
  { id:"warjunk",     name:"War Junk",        icon:"🚢", cat:"naval",    hp:500,  atk:50,  aspd:3.0,  range:8,  armor:2, spd:1.25, trainTime:50, trainCostF:0,   trainCostG:300 },
  { id:"dhow",        name:"Dhow",            icon:"🛶", cat:"naval",    hp:280,  atk:18,  aspd:1.75, range:6,  armor:0, spd:1.75, trainTime:25, trainCostF:0,   trainCostG:120 },
  { id:"carrack",     name:"Carrack",         icon:"🚤", cat:"naval",    hp:650,  atk:70,  aspd:4.0,  range:9,  armor:3, spd:1.00, trainTime:80, trainCostF:0,   trainCostG:500 },
  { id:"firelauncher",name:"Fire Launcher",   icon:"🔥", cat:"naval",    hp:200,  atk:40,  aspd:3.0,  range:6,  armor:0, spd:1.62, trainTime:40, trainCostF:0,   trainCostG:200 },
];
const CIVS = [
  { id:"english",    name:"English",         flag:"🇬🇧", bonusName:"Farm Heartland",    bonusDesc:"Farm gather rate bonus (%)",          base:10,  minVal:-50, maxVal:100 },
  { id:"french",     name:"French",          flag:"🇫🇷", bonusName:"Chivalry",          bonusDesc:"Cavalry cost reduction (%)",          base:-15, minVal:-80, maxVal:50  },
  { id:"hre",        name:"HRE",             flag:"🏰",  bonusName:"Inspired Warriors", bonusDesc:"Relic aura radius bonus (%)",         base:15,  minVal:-50, maxVal:100 },
  { id:"mongols",    name:"Mongols",         flag:"🐎",  bonusName:"Siha Bow Limb",     bonusDesc:"Cavalry attack bonus (%)",            base:10,  minVal:-50, maxVal:100 },
  { id:"rus",        name:"Rus",             flag:"⚔️",  bonusName:"Hunting Bounty",    bonusDesc:"Hunt gold yield bonus (%)",           base:15,  minVal:-50, maxVal:100 },
  { id:"delhi",      name:"Delhi Sultanate", flag:"🕌",  bonusName:"Sanctity",          bonusDesc:"Technology time reduction (%)",       base:-20, minVal:-90, maxVal:50  },
  { id:"abbasid",    name:"Abbasid Dynasty", flag:"🌙",  bonusName:"Culture Wing",      bonusDesc:"Gather rate bonus (%)",               base:15,  minVal:-50, maxVal:100 },
  { id:"chinese",    name:"Chinese",         flag:"🐉",  bonusName:"Imperial Officials",bonusDesc:"Tax collection bonus (%)",            base:20,  minVal:-50, maxVal:100 },
  { id:"ottomans",   name:"Ottomans",        flag:"🌟",  bonusName:"Grand Bazaar",      bonusDesc:"Free unit production interval (sec)", base:120, minVal:30,  maxVal:600 },
  { id:"malians",    name:"Malians",         flag:"☀️",  bonusName:"Toll Outposts",     bonusDesc:"Trade income bonus (%)",              base:15,  minVal:-50, maxVal:100 },
  { id:"byzantines", name:"Byzantines",      flag:"⚜️",  bonusName:"Greek Fire",        bonusDesc:"Anti-ship damage bonus (%)",          base:15,  minVal:-50, maxVal:100 },
  { id:"japanese",   name:"Japanese",        flag:"⛩️",  bonusName:"Floating Gate",     bonusDesc:"Castle production bonus (%)",         base:10,  minVal:-50, maxVal:100 },
  { id:"jeanne",     name:"Jeanne d'Arc",    flag:"🌸",  bonusName:"Companions",        bonusDesc:"Hero aura ally buff (%)",             base:10,  minVal:-50, maxVal:100 },
  { id:"ayyubids",   name:"Ayyubids",        flag:"🏺",  bonusName:"Fresh Foodstuffs",  bonusDesc:"Feudal income bonus (%)",             base:10,  minVal:-50, maxVal:100 },
  { id:"zhu",        name:"Zhu Xi's Legacy", flag:"🎴",  bonusName:"Imperial Academy",  bonusDesc:"Wonder output bonus (%)",             base:15,  minVal:-50, maxVal:100 },
  { id:"orderdragon",name:"Order of Dragon", flag:"🐲",  bonusName:"Dragon's Might",    bonusDesc:"Banner buff strength (%)",            base:15,  minVal:-50, maxVal:100 },
];
const BUILDINGS = [
  { id:"tc",          name:"Town Center",    icon:"🏘️", cat:"core",      food:400, wood:0,   gold:0,   stone:300, time:240, hp:5000, garrison:15 },
  { id:"barracks",    name:"Barracks",       icon:"⚔️", cat:"military",  food:0,   wood:150, gold:0,   stone:0,   time:30,  hp:1000, garrison:0  },
  { id:"stable",      name:"Stable",         icon:"🐴", cat:"military",  food:0,   wood:175, gold:0,   stone:0,   time:30,  hp:1000, garrison:0  },
  { id:"archrange",   name:"Archery Range",  icon:"🏹", cat:"military",  food:0,   wood:150, gold:0,   stone:0,   time:30,  hp:1000, garrison:0  },
  { id:"siegeworks",  name:"Siege Workshop", icon:"💣", cat:"military",  food:0,   wood:200, gold:0,   stone:0,   time:45,  hp:1000, garrison:0  },
  { id:"blacksmith",  name:"Blacksmith",     icon:"⚒️", cat:"economy",   food:0,   wood:150, gold:0,   stone:0,   time:30,  hp:1000, garrison:0  },
  { id:"mill",        name:"Mill",           icon:"🌾", cat:"economy",   food:0,   wood:75,  gold:0,   stone:0,   time:20,  hp:750,  garrison:0  },
  { id:"lumbercamp",  name:"Lumber Camp",    icon:"🪵", cat:"economy",   food:0,   wood:50,  gold:0,   stone:0,   time:15,  hp:500,  garrison:0  },
  { id:"miningcamp",  name:"Mining Camp",    icon:"⛏️", cat:"economy",   food:0,   wood:50,  gold:0,   stone:0,   time:15,  hp:500,  garrison:0  },
  { id:"market",      name:"Market",         icon:"🛒", cat:"economy",   food:0,   wood:200, gold:0,   stone:0,   time:30,  hp:1000, garrison:0  },
  { id:"outpost",     name:"Outpost",        icon:"🗼", cat:"defensive", food:0,   wood:50,  gold:0,   stone:25,  time:20,  hp:1000, garrison:5  },
  { id:"palisade",    name:"Palisade Wall",  icon:"🌲", cat:"defensive", food:0,   wood:2,   gold:0,   stone:0,   time:3,   hp:250,  garrison:0  },
  { id:"stonewall",   name:"Stone Wall",     icon:"🧱", cat:"defensive", food:0,   wood:0,   gold:0,   stone:5,   time:8,   hp:1000, garrison:0  },
  { id:"keep",        name:"Keep",           icon:"🏰", cat:"defensive", food:0,   wood:0,   gold:0,   stone:350, time:60,  hp:4000, garrison:20 },
  { id:"dock",        name:"Dock",           icon:"⚓", cat:"naval",     food:0,   wood:150, gold:0,   stone:0,   time:30,  hp:1000, garrison:0  },
  { id:"university",  name:"University",     icon:"🎓", cat:"research",  food:0,   wood:100, gold:100, stone:0,   time:45,  hp:1000, garrison:0  },
  { id:"monastery",   name:"Monastery",      icon:"⛪", cat:"research",  food:0,   wood:100, gold:100, stone:0,   time:45,  hp:1000, garrison:0  },
  { id:"wonder",      name:"Wonder",         icon:"✨", cat:"wonder",    food:0,   wood:0,   gold:0,   stone:3000,time:600, hp:10000,garrison:0  },
];
const TECHS = [
  { id:"wheelbarrow",  name:"Wheelbarrow",        icon:"🛒", cat:"economy",  costF:75,  costG:0,   time:25, effect:"+15% carry cap"         },
  { id:"broadaxe",     name:"Double Broadaxe",    icon:"🪓", cat:"economy",  costF:100, costG:0,   time:30, effect:"+15% wood rate"         },
  { id:"horticulture", name:"Horticulture",        icon:"🌱", cat:"economy",  costF:150, costG:75,  time:45, effect:"+15% farm efficiency"   },
  { id:"biology",      name:"Biology",             icon:"🧬", cat:"economy",  costF:200, costG:100, time:60, effect:"+40% farm output"       },
  { id:"forestry",     name:"Forestry",            icon:"🌲", cat:"economy",  costF:50,  costG:0,   time:20, effect:"+10% forest wood"       },
  { id:"herbal",       name:"Herbal Medicine",     icon:"🌿", cat:"economy",  costF:75,  costG:150, time:40, effect:"Monks heal 3×"          },
  { id:"chivalry",     name:"Chivalry",            icon:"⚔️", cat:"military", costF:200, costG:100, time:45, effect:"Cavalry train 25% faster"},
  { id:"siege_works",  name:"Siege Works",         icon:"💣", cat:"military", costF:0,   costG:200, time:60, effect:"+20% siege dmg"         },
  { id:"chemistry",    name:"Chemistry",           icon:"⚗️", cat:"military", costF:0,   costG:400, time:75, effect:"+10 ranged dmg"         },
  { id:"espionage",    name:"Espionage",           icon:"🕵️", cat:"military", costF:0,   costG:250, time:60, effect:"+10% scout vision"      },
  { id:"incendiary",   name:"Incendiary Arrows",   icon:"🔥", cat:"military", costF:100, costG:100, time:45, effect:"Archers fire dmg"       },
  { id:"longbow",      name:"Longbow Mastery",     icon:"🏹", cat:"military", costF:0,   costG:200, time:45, effect:"+1 archer range"        },
  { id:"plateback",    name:"Plate Barding",       icon:"🛡️", cat:"military", costF:0,   costG:350, time:60, effect:"+2 cavalry armor"       },
  { id:"pro_scouts",   name:"Professional Scouts", icon:"🐎", cat:"military", costF:150, costG:0,   time:30, effect:"+15% scout speed"       },
  { id:"armored_hull", name:"Armored Hull",        icon:"⚓", cat:"naval",    costF:0,   costG:300, time:60, effect:"+20% ship HP"           },
];
const AGES = [
  { id:"age2", name:"Dark → Feudal Age",     icon:"🌱", baseCost:400,  baseTime:40,  basePopReq:0  },
  { id:"age3", name:"Feudal → Castle Age",   icon:"🏰", baseCost:1200, baseTime:75,  basePopReq:10 },
  { id:"age4", name:"Castle → Imperial Age", icon:"⚜️", baseCost:2400, baseTime:100, basePopReq:20 },
];
const LANDMARKS = [
  { id:"abbey_kings",   name:"Abbey of Kings",      civ:"hre",       icon:"⛪", hp:5000, food:0,   wood:0,   gold:0,   stone:700  },
  { id:"aachen",        name:"Aachen Chapel",        civ:"hre",       icon:"🏰", hp:6000, food:0,   wood:0,   gold:0,   stone:1000 },
  { id:"berkshire",     name:"Berkshire Palace",     civ:"english",   icon:"🏯", hp:5000, food:0,   wood:0,   gold:0,   stone:650  },
  { id:"council_hall",  name:"Council Hall",         civ:"english",   icon:"🏛️", hp:4000, food:0,   wood:200, gold:0,   stone:500  },
  { id:"royal_palace",  name:"Royal Palace",         civ:"french",    icon:"👑", hp:5000, food:0,   wood:0,   gold:200, stone:700  },
  { id:"guild_hall",    name:"Guild Hall",           civ:"french",    icon:"🏘️", hp:4000, food:0,   wood:200, gold:200, stone:400  },
  { id:"ger",           name:"The Ger",              civ:"mongols",   icon:"🏕️", hp:3000, food:200, wood:200, gold:0,   stone:0    },
  { id:"steppe_redoubt",name:"Steppe Redoubt",       civ:"mongols",   icon:"🗼", hp:4000, food:0,   wood:0,   gold:0,   stone:600  },
  { id:"white_tower",   name:"White Tower",          civ:"rus",       icon:"🗽", hp:6000, food:0,   wood:0,   gold:0,   stone:1000 },
  { id:"kremlin",       name:"The Kremlin",          civ:"rus",       icon:"🏰", hp:7000, food:0,   wood:0,   gold:0,   stone:1200 },
  { id:"sultan_palace", name:"Sultan's Palace",      civ:"delhi",     icon:"🕌", hp:5000, food:0,   wood:0,   gold:0,   stone:800  },
  { id:"house_learning",name:"House of Learning",    civ:"abbasid",   icon:"📚", hp:4000, food:0,   wood:200, gold:100, stone:300  },
  { id:"palace_sultan", name:"Palace of the Sultan", civ:"ottomans",  icon:"🌟", hp:6000, food:0,   wood:0,   gold:500, stone:500  },
  { id:"great_wall",    name:"Great Wall Gatehouse", civ:"chinese",   icon:"🐉", hp:8000, food:0,   wood:0,   gold:0,   stone:1500 },
  { id:"malian_market", name:"Grand Fulani Corral",  civ:"malians",   icon:"☀️", hp:4500, food:300, wood:0,   gold:0,   stone:300  },
  { id:"cistern",       name:"Cistern of the First", civ:"byzantines",icon:"⚜️", hp:5500, food:0,   wood:0,   gold:300, stone:600  },
];
const PRESETS=[{id:"vanilla",name:"Vanilla",icon:"🎮",desc:"Reset everything to base game"},{id:"fastgame",name:"Fast Game",icon:"⚡",desc:"Cheaper ages, 1.5× gather rates"},{id:"warmode",name:"War Mode",icon:"💀",desc:"All units +50% attack, −25% HP"},{id:"tank",name:"Turtle Mode",icon:"🐢",desc:"Buildings & units 2× HP"},{id:"richstart",name:"Rich Start",icon:"💰",desc:"500F 400W 300G 300S at start"},{id:"nerfsiege",name:"Nerf Siege",icon:"🎯",desc:"Siege units −40% damage"},{id:"cavalry",name:"Cavalry Meta",icon:"🐴",desc:"All cavalry +30% speed & attack"},{id:"economy",name:"Economy Rush",icon:"🌾",desc:"2× gather rates, 2× carry capacity"}];
const TABS=[["meta","📋 Info"],["presets","⚡ Presets"],["globals","🌐 Globals"],["units","⚔️ Units"],["buildings","🏰 Buildings"],["civs","🏛️ Civs"],["resources","💰 Economy"],["ages","📜 Ages"],["techs","🔬 Techs"],["landmarks","🗺️ Landmarks"],["flags","🚩 Flags"],["changelog","📝 Changes"],["install","📖 Install"],["export","📦 Export"]];

const C={bg:"#0d0b08",bg2:"#141108",bg3:"#1c1710",bg4:"#252019",border:"#3a2e1a",border2:"#5a4820",gold:"#c8a84b",gold2:"#e8c96a",goldDim:"#7a6430",red:"#c84030",green:"#40a060",text:"#e8d9b0",text2:"#b8a878",text3:"#7a6840",blue:"#3080c8"};
const mk={
  app:{background:C.bg,minHeight:"100vh",fontFamily:"Georgia,serif",color:C.text,display:"flex",flexDirection:"column",fontSize:14},
  hdr:{background:`linear-gradient(180deg,#000,${C.bg2})`,borderBottom:`2px solid ${C.border2}`,padding:"0 14px",position:"sticky",top:0,zIndex:100,boxShadow:"0 4px 30px rgba(0,0,0,0.9)"},
  hdrIn:{maxWidth:1300,margin:"0 auto",display:"flex",alignItems:"center",height:56,gap:10},
  emblem:{width:36,height:36,border:`2px solid ${C.gold}`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,background:`radial-gradient(circle,${C.bg4},${C.bg})`,flexShrink:0},
  tabBar:{display:"flex",gap:1,flex:1,overflowX:"auto"},
  tab:(a)=>({padding:"5px 9px",borderRadius:3,cursor:"pointer",fontSize:10,letterSpacing:1,color:a?C.gold2:C.text3,background:a?`rgba(200,168,75,0.12)`:"transparent",border:a?`1px solid ${C.border2}`:"1px solid transparent",whiteSpace:"nowrap",fontFamily:"Georgia,serif",userSelect:"none"}),
  body:{flex:1,maxWidth:1300,margin:"0 auto",padding:"16px 14px",width:"100%"},
  panel:{background:`linear-gradient(135deg,${C.bg3},${C.bg2})`,border:`1px solid ${C.border}`,borderRadius:6,marginBottom:12,overflow:"hidden"},
  pH:{padding:"8px 13px",background:"rgba(0,0,0,0.4)",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:7,fontSize:10,color:C.gold,letterSpacing:1,textTransform:"uppercase",fontFamily:"Georgia,serif",cursor:"pointer",userSelect:"none"},
  pB:{padding:13},
  g2:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11},
  g3:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:9},
  g4:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7},
  lbl:{display:"block",fontSize:9,letterSpacing:1.5,color:C.text3,textTransform:"uppercase",marginBottom:3,fontFamily:"Georgia,serif"},
  inp:{width:"100%",background:"rgba(0,0,0,0.6)",border:`1px solid ${C.border}`,borderRadius:4,color:C.text,padding:"6px 10px",fontSize:13,fontFamily:"Georgia,serif",outline:"none",boxSizing:"border-box"},
  inpSm:{background:"rgba(0,0,0,0.6)",border:`1px solid ${C.border}`,borderRadius:3,color:C.text,padding:"4px 7px",fontSize:12,fontFamily:"Georgia,serif",outline:"none",width:"100%",boxSizing:"border-box"},
  ta:{width:"100%",background:"rgba(0,0,0,0.6)",border:`1px solid ${C.border}`,borderRadius:4,color:C.text,padding:"6px 10px",fontSize:13,fontFamily:"Georgia,serif",outline:"none",resize:"vertical",minHeight:60,boxSizing:"border-box"},
  sc:{padding:8,background:"rgba(0,0,0,0.4)",border:`1px solid ${C.border}`,borderRadius:5,display:"flex",flexDirection:"column",gap:5},
  cbox:{background:"rgba(0,0,0,0.4)",border:`1px solid ${C.border}`,borderRadius:5,padding:9,textAlign:"center"},
  div:{border:"none",borderTop:`1px solid ${C.border}`,margin:"10px 0"},
  help:{background:"rgba(200,168,75,0.04)",border:`1px solid rgba(200,168,75,0.12)`,borderRadius:5,padding:"9px 12px",marginBottom:12,fontSize:12,color:C.text3,fontStyle:"italic",lineHeight:1.6},
  stitle:{fontFamily:"Georgia,serif",fontSize:17,color:C.gold2,letterSpacing:2,marginBottom:2},
  ssub:{fontSize:11,color:C.text3,marginBottom:14},
};

const Btn=({variant="primary",children,onClick,style={}})=>{
  const base={padding:"5px 13px",borderRadius:3,cursor:"pointer",fontFamily:"Georgia,serif",fontSize:10,letterSpacing:1,textTransform:"uppercase",border:"1px solid transparent",display:"inline-flex",alignItems:"center",gap:5,background:"none"};
  const vars={primary:{background:`linear-gradient(135deg,${C.goldDim},${C.gold})`,color:C.bg,fontWeight:"bold"},secondary:{background:"transparent",color:C.text2,border:`1px solid ${C.border2}`},danger:{background:"transparent",color:C.red,border:`1px solid rgba(200,64,48,0.4)`},export:{background:`linear-gradient(135deg,#1a5a30,${C.green})`,color:"#a0f0b0",fontWeight:"bold",fontSize:12,padding:"8px 18px"},ghost:{background:"rgba(200,168,75,0.07)",color:C.gold,border:`1px solid ${C.border}`}};
  return <button onClick={onClick} style={{...base,...(vars[variant]||vars.primary),...style}}>{children}</button>;
};
const Badge=({color="gold",children,style={}})=>{
  const cols={gold:{bg:"rgba(200,168,75,0.15)",c:C.gold,b:"rgba(200,168,75,0.3)"},green:{bg:"rgba(64,160,96,0.15)",c:C.green,b:"rgba(64,160,96,0.3)"},red:{bg:"rgba(200,64,48,0.15)",c:C.red,b:"rgba(200,64,48,0.3)"},blue:{bg:"rgba(48,128,200,0.15)",c:C.blue,b:"rgba(48,128,200,0.3)"}};
  const t=cols[color]||cols.gold;
  return <span style={{display:"inline-flex",alignItems:"center",padding:"1px 7px",borderRadius:10,fontSize:9,fontFamily:"Georgia,serif",background:t.bg,color:t.c,border:`1px solid ${t.b}`,...style}}>{children}</span>;
};
const Panel=({id,icon,title,badge,children,defaultOpen=true,collapsed,toggleP})=>{
  const open=collapsed[id]===undefined?defaultOpen:!collapsed[id];
  return(
    <div style={mk.panel}>
      <div style={mk.pH} onClick={()=>toggleP(id)}>
        <span>{icon}</span>{title}
        {badge&&<Badge color="green" style={{marginLeft:6,fontSize:8}}>{badge}</Badge>}
        <span style={{marginLeft:"auto",color:C.text3,fontSize:9,transform:open?"none":"rotate(-90deg)",transition:"transform 0.2s"}}>▼</span>
      </div>
      {open&&<div style={mk.pB}>{children}</div>}
    </div>
  );
};
const StatSlider=({label,value,baseDisplay,min,max,step,fmt,onChange,disabled=false,mode="mult"})=>{
  const eps=step*0.4;
  const isBase=mode==="mult"?Math.abs(value-1)<eps:Math.abs(value-baseDisplay)<eps;
  const isBuffed=mode==="mult"?value>1+eps:value>baseDisplay+eps;
  const isNerfed=mode==="mult"?value<1-eps:value<baseDisplay-eps;
  const col=isBase?C.gold:isBuffed?C.green:C.red;
  let pctStr="Base";
  if(!isBase){
    if(mode==="mult"){const p=Math.round((value-1)*100);pctStr=`${isBuffed?"▲ +":"▼ "}${Math.abs(p)}%`;}
    else if(baseDisplay!==0){const p=Math.round(((value/baseDisplay)-1)*100);pctStr=`${isBuffed?"▲ +":"▼ "}${Math.abs(p)}%`;}
    else{pctStr=`${isBuffed?"▲ +":"▼ "}${Math.abs(value-baseDisplay)}`;}
  }
  return(
    <div style={{...mk.sc,opacity:disabled?0.4:1}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:10,color:C.text2}}>{label}</span>
        <div style={{display:"flex",gap:4,alignItems:"center"}}>
          <span style={{fontSize:9,color:C.text3}}>base:{disabled?"—":baseDisplay}</span>
          <span style={{display:"inline-flex",alignItems:"center",padding:"1px 7px",borderRadius:10,fontSize:9,fontFamily:"Georgia,serif",background:`rgba(${isBuffed?"64,160,96":isNerfed?"200,64,48":"200,168,75"},0.15)`,color:col,border:`1px solid ${col}44`,minWidth:36,justifyContent:"center"}}>{fmt(value)}</span>
        </div>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} disabled={disabled} onChange={e=>onChange(parseFloat(e.target.value))} style={{width:"100%",accentColor:C.gold,cursor:disabled?"not-allowed":"pointer"}}/>
      <div style={{textAlign:"right",fontSize:9,height:11,color:isBase?C.text3:col}}>{pctStr}</div>
    </div>
  );
};
const Toggle=({on,onChange,label,desc,last=false})=>(
  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:last?"none":`1px solid rgba(58,46,26,0.35)`}}>
    <div><div style={{fontSize:13,color:C.text}}>{label}</div>{desc&&<div style={{fontSize:10,color:C.text3,fontStyle:"italic"}}>{desc}</div>}</div>
    <div onClick={()=>onChange(!on)} style={{width:36,height:20,background:on?`rgba(200,168,75,0.28)`:"rgba(0,0,0,0.5)",border:`1px solid ${on?C.gold:C.border}`,borderRadius:10,position:"relative",cursor:"pointer",transition:"all 0.2s",flexShrink:0,marginLeft:12}}>
      <div style={{position:"absolute",top:2,left:on?18:2,width:14,height:14,background:on?C.gold2:C.text3,borderRadius:"50%",transition:"all 0.2s",boxShadow:on?"0 0 6px rgba(200,168,75,0.5)":"none"}}/>
    </div>
  </div>
);
const NumInput=({value,onChange,min=0,max=99999,icon,label})=>(
  <div style={mk.cbox}>
    {icon&&<div style={{fontSize:17,marginBottom:3}}>{icon}</div>}
    {label&&<div style={{...mk.lbl,textAlign:"center",marginBottom:4}}>{label}</div>}
    <input type="number" style={{...mk.inpSm,textAlign:"center"}} value={value} min={min} max={max} onChange={e=>onChange(Math.max(min,Math.min(max,parseInt(e.target.value)||0)))}/>
  </div>
);

const VANILLA_RES={gF:1,gW:1,gG:1,gS:1,cF:1,cW:1,cG:1,cS:1,sF:200,sW:150,sG:100,sS:200,tradeMult:1};
const VANILLA_GLOBALS={popCap:200,unitHpMult:1,unitAtkMult:1,unitSpdMult:1,bldgHpMult:1,trainMult:1,techMult:1,gatherMult:1};
const VANILLA_FLAGS={infiniteRes:false,noFog:false,noWonder:false,instantTrain:false,instantTech:false,noPop:false,allAge1:false,symCivs:false};

export default function App(){
  const [tab,setTab]=useState("meta");
  const [unitFilter,setUnitFilter]=useState("all");
  const [bldgFilter,setBldgFilter]=useState("all");
  const [selUnit,setSelUnit]=useState(null);
  const [selCiv,setSelCiv]=useState(null);
  const [collapsed,setCollapsed]=useState({});
  const [toast,setToast]=useState(null);
  const [unitSearch,setUnitSearch]=useState("");
  const [exporting,setExporting]=useState(false);
  const toastTimer=useRef(null);
  const jsZipLoaded=useRef(false);
  useEffect(()=>()=>{if(toastTimer.current)clearTimeout(toastTimer.current);},[]);

  const [meta,setMeta]=useState({name:"My AoE4 Mod",version:"1.0.0",author:"",desc:"",tags:"balance,gameplay",mp:false,campaign:true,skirmish:true});
  const [unitMods,setUnitMods]=useState({});
  const [unitTrain,setUnitTrain]=useState({});
  const [bldgMods,setBldgMods]=useState({});
  const [civMods,setCivMods]=useState({});
  const [ageMods,setAgeMods]=useState({});
  const [techMods,setTechMods]=useState({});
  const [lmMods,setLmMods]=useState({});
  const [res,setRes]=useState(VANILLA_RES);
  const [globals,setGlobals]=useState(VANILLA_GLOBALS);
  const [flags,setFlags]=useState(VANILLA_FLAGS);

  const toggleP=useCallback(id=>setCollapsed(p=>({...p,[id]:!p[id]})),[]);

  const getUM=id=>unitMods[id]||{hp:1,atk:1,aspd:1,range:1,armor:1,spd:1};
  const getUTM=id=>{const u=UNITS.find(x=>x.id===id);return unitTrain[id]||{trainTime:u.trainTime,trainCostF:u.trainCostF,trainCostG:u.trainCostG};};
  const getBM=id=>{const b=BUILDINGS.find(x=>x.id===id);return bldgMods[id]||{food:b.food,wood:b.wood,gold:b.gold,stone:b.stone,time:b.time,hp:b.hp,garrison:b.garrison};};
  const getCM=id=>{const c=CIVS.find(x=>x.id===id);return civMods[id]||{bonus:c.base,disabled:false};};
  const getAM=id=>{const a=AGES.find(x=>x.id===id);return ageMods[id]||{cost:a.baseCost,time:a.baseTime,popReq:a.basePopReq};};
  const getTM=id=>{const t=TECHS.find(x=>x.id===id);return techMods[id]||{costF:t.costF,costG:t.costG,time:t.time};};
  const getLM=id=>{const l=LANDMARKS.find(x=>x.id===id);return lmMods[id]||{hp:l.hp,food:l.food,wood:l.wood,gold:l.gold,stone:l.stone};};

  const setUS=(id,k,v)=>setUnitMods(p=>({...p,[id]:{...getUM(id),[k]:v}}));
  const setUTS=(id,k,v)=>setUnitTrain(p=>({...p,[id]:{...getUTM(id),[k]:v}}));
  const setBS=(id,k,v)=>setBldgMods(p=>({...p,[id]:{...getBM(id),[k]:typeof v==="number"?Math.round(v):v}}));

  const isUnitMod=id=>{const m=unitMods[id];const tm=unitTrain[id];const u=UNITS.find(x=>x.id===id);if(m&&Object.values(m).some(v=>Math.abs(v-1)>0.01))return true;if(tm&&(tm.trainTime!==u.trainTime||tm.trainCostF!==u.trainCostF||tm.trainCostG!==u.trainCostG))return true;return false;};
  const isBldgMod=id=>{const m=bldgMods[id];if(!m)return false;const b=BUILDINGS.find(x=>x.id===id);return Object.keys(m).some(k=>m[k]!==b[k]);};
  const isCivMod=id=>{const m=civMods[id];if(!m)return false;const c=CIVS.find(x=>x.id===id);return m.bonus!==c.base||m.disabled;};
  const isTechMod=id=>{const m=techMods[id];if(!m)return false;const t=TECHS.find(x=>x.id===id);return m.costF!==t.costF||m.costG!==t.costG||m.time!==t.time;};

  const totalChanges=useMemo(()=>{
    let n=0;
    UNITS.forEach(u=>{if(isUnitMod(u.id))n++;});
    BUILDINGS.forEach(b=>{if(isBldgMod(b.id))n++;});
    CIVS.forEach(c=>{if(isCivMod(c.id))n++;});
    TECHS.forEach(t=>{if(isTechMod(t.id))n++;});
    AGES.forEach(a=>{const m=ageMods[a.id];if(m&&(m.cost!==a.baseCost||m.time!==a.baseTime||m.popReq!==a.basePopReq))n++;});
    LANDMARKS.forEach(l=>{const m=lmMods[l.id];if(m){const base=LANDMARKS.find(x=>x.id===l.id);if(Object.keys(m).some(k=>m[k]!==base[k]))n++;}});
    ["gF","gW","gG","gS","cF","cW","cG","cS"].forEach(k=>{if(Math.abs(res[k]-1)>0.01)n++;});
    if(res.sF!==200||res.sW!==150||res.sG!==100||res.sS!==200)n++;
    if(Math.abs(res.tradeMult-1)>0.01)n++;
    if(globals.popCap!==200)n++;
    ["unitHpMult","unitAtkMult","unitSpdMult","bldgHpMult","trainMult","techMult","gatherMult"].forEach(k=>{if(Math.abs(globals[k]-1)>0.01)n++;});
    Object.values(flags).forEach(v=>{if(v)n++;});
    return n;
  },[unitMods,unitTrain,bldgMods,civMods,ageMods,techMods,lmMods,res,globals,flags,isUnitMod,isBldgMod,isCivMod,isTechMod]);

  const showToast=(msg,type="info")=>{setToast({msg,type});if(toastTimer.current)clearTimeout(toastTimer.current);toastTimer.current=setTimeout(()=>setToast(null),3000);};

  const applyPreset=id=>{
    if(id==="vanilla"){setUnitMods({});setUnitTrain({});setBldgMods({});setCivMods({});setAgeMods({});setTechMods({});setLmMods({});setRes(VANILLA_RES);setGlobals(VANILLA_GLOBALS);setFlags(VANILLA_FLAGS);showToast("↩ Reset to Vanilla","info");return;}
    if(id==="fastgame"){setAgeMods({age2:{cost:200,time:22,popReq:0},age3:{cost:600,time:45,popReq:5},age4:{cost:1200,time:65,popReq:10}});setGlobals(p=>({...p,gatherMult:1.5}));showToast("⚡ Fast Game applied","success");return;}
    if(id==="warmode"){setGlobals(p=>({...p,unitAtkMult:1.5,unitHpMult:0.75}));showToast("💀 War Mode applied","success");return;}
    if(id==="tank"){setGlobals(p=>({...p,unitHpMult:2,bldgHpMult:2}));showToast("🐢 Turtle Mode applied","success");return;}
    if(id==="richstart"){setRes(p=>({...p,sF:500,sW:400,sG:300,sS:300}));showToast("💰 Rich Start applied","success");return;}
    if(id==="nerfsiege"){setUnitMods(prev=>{const n={...prev};UNITS.filter(u=>u.cat==="siege").forEach(u=>{n[u.id]={...(prev[u.id]||{hp:1,atk:1,aspd:1,range:1,armor:1,spd:1}),atk:0.6};});return n;});showToast("🎯 Siege -40% dmg applied","success");return;}
    if(id==="cavalry"){setUnitMods(prev=>{const n={...prev};UNITS.filter(u=>u.cat==="cavalry").forEach(u=>{n[u.id]={...(prev[u.id]||{hp:1,atk:1,aspd:1,range:1,armor:1,spd:1}),atk:1.3,spd:1.3};});return n;});showToast("🐴 Cavalry Meta applied","success");return;}
    if(id==="economy"){setGlobals(p=>({...p,gatherMult:2}));setRes(p=>({...p,cF:2,cW:2,cG:2,cS:2}));showToast("🌾 Economy Rush applied","success");return;}
  };
  const resetAll=()=>{setUnitMods({});setUnitTrain({});setBldgMods({});setCivMods({});setAgeMods({});setTechMods({});setLmMods({});setRes(VANILLA_RES);setGlobals(VANILLA_GLOBALS);setFlags(VANILLA_FLAGS);setSelUnit(null);setSelCiv(null);setCollapsed({});showToast("↩ All changes reset","info");};

  const buildJSON=useCallback(()=>{
    const unitOut={};
    UNITS.forEach(u=>{
      const m=unitMods[u.id];const tm=unitTrain[u.id];
      const hasStat=m&&Object.values(m).some(v=>Math.abs(v-1)>0.01);
      const hasTrain=tm&&(tm.trainTime!==u.trainTime||tm.trainCostF!==u.trainCostF||tm.trainCostG!==u.trainCostG);
      if(!hasStat&&!hasTrain)return;
      const mod=m||{hp:1,atk:1,aspd:1,range:1,armor:1,spd:1};
      unitOut[u.id]={display_name:u.name,base:{hp:u.hp,attack_damage:u.atk,attack_speed:u.aspd,range:u.range,armor:u.armor,move_speed:u.spd,train_time:u.trainTime,train_cost_food:u.trainCostF,train_cost_gold:u.trainCostG},modded:{hp:Math.round(u.hp*mod.hp*globals.unitHpMult),attack_damage:Math.round(u.atk*mod.atk*globals.unitAtkMult),attack_speed:parseFloat((u.aspd*(mod.aspd||1)).toFixed(3)),range:u.range===0?0:parseFloat((u.range*(mod.range||1)).toFixed(2)),armor:parseFloat((u.armor*(mod.armor||1)).toFixed(2)),move_speed:parseFloat((u.spd*mod.spd*globals.unitSpdMult).toFixed(3)),train_time:tm?Math.round(tm.trainTime*globals.trainMult):Math.round(u.trainTime*globals.trainMult),train_cost_food:tm?tm.trainCostF:u.trainCostF,train_cost_gold:tm?tm.trainCostG:u.trainCostG},stat_multipliers:mod};
    });
    const bldgOut={};
    Object.entries(bldgMods).forEach(([id,m])=>{const b=BUILDINGS.find(x=>x.id===id);bldgOut[id]={display_name:b.name,base:{food:b.food,wood:b.wood,gold:b.gold,stone:b.stone,build_time:b.time,hp:b.hp,garrison:b.garrison},modded:{...m,hp:Math.round(m.hp*globals.bldgHpMult)}};});
    return {name:meta.name,version:meta.version,author:meta.author,description:meta.desc,tags:meta.tags.split(",").map(t=>t.trim()).filter(Boolean),game:"Age of Empires IV",type:"data_mod",compatibility:{multiplayer:meta.mp,campaign:meta.campaign,skirmish:meta.skirmish},global_modifiers:globals,gameplay_flags:flags,unit_modifications:unitOut,building_modifications:bldgOut,civilization_modifications:Object.fromEntries(Object.entries(civMods).map(([id,m])=>{const c=CIVS.find(x=>x.id===id);return[id,{display_name:c.name,bonus_name:c.bonusName,base:c.base,modded:m.bonus,disabled:m.disabled}];})),age_modifications:Object.fromEntries(Object.entries(ageMods).map(([id,m])=>{const a=AGES.find(x=>x.id===id);return[id,{name:a.name,base:{cost:a.baseCost,time:a.baseTime,popReq:a.basePopReq},modded:m}];})),technology_modifications:Object.fromEntries(Object.entries(techMods).map(([id,m])=>{const t=TECHS.find(x=>x.id===id);return[id,{name:t.name,base:{costF:t.costF,costG:t.costG,time:t.time},modded:{...m,time:Math.round(m.time*globals.techMult)}}];})),landmark_modifications:Object.fromEntries(Object.entries(lmMods).map(([id,m])=>{const l=LANDMARKS.find(x=>x.id===id);return[id,{name:l.name,civ:l.civ,...m}];})),resource_economy:{gather_multipliers:{food:parseFloat((res.gF*globals.gatherMult).toFixed(3)),wood:parseFloat((res.gW*globals.gatherMult).toFixed(3)),gold:parseFloat((res.gG*globals.gatherMult).toFixed(3)),stone:parseFloat((res.gS*globals.gatherMult).toFixed(3))},carry_multipliers:{food:res.cF,wood:res.cW,gold:res.cG,stone:res.cS},starting_resources:{food:res.sF,wood:res.sW,gold:res.sG,stone:res.sS},trade_multiplier:res.tradeMult},population_cap:globals.popCap,total_changes:totalChanges,generated_at:new Date().toISOString(),generated_by:"Forge of Empires Mod Builder v4"};
  },[unitMods,unitTrain,bldgMods,civMods,ageMods,techMods,lmMods,res,globals,flags,meta,totalChanges]);

  const exportMod=()=>{
    if(exporting)return;
    setExporting(true);
    const doExport=()=>{
      try{
        const json=buildJSON();
        const folder=(meta.name||"my-mod").replace(/[^a-zA-Z0-9\-_]/g,"-").toLowerCase();
        const readme=[meta.name,"=".repeat(meta.name.length),`Version: ${meta.version}`,`Author: ${meta.author||"Anonymous"}`,"","INSTALLATION","============","1. Extract this ZIP into:","   C:\\Users\\[YourName]\\Games\\Age of Empires IV\\mods\\local\\","2. Launch Age of Empires IV","3. Go to Home → Mods → My Mods","4. Enable this mod and restart if prompted","",`Total changes: ${totalChanges}`,`Generated: ${new Date().toLocaleString()}`].join("\n");
        const zip=new window.JSZip();
        const f=zip.folder(folder);
        f.file("mod.json",JSON.stringify(json,null,2));
        f.file("modinfo.json",JSON.stringify({ModName:meta.name,ModVersion:meta.version,IsDataMod:true,RequiredForMultiplayer:meta.mp,Author:meta.author,Description:meta.desc},null,2));
        f.file("README.txt",readme);
        const att=f.folder("attrib");
        att.file("unit_stats.json",JSON.stringify(json.unit_modifications,null,2));
        att.file("building_costs.json",JSON.stringify(json.building_modifications,null,2));
        att.file("civ_bonuses.json",JSON.stringify(json.civilization_modifications,null,2));
        att.file("resource_rates.json",JSON.stringify(json.resource_economy,null,2));
        att.file("global_settings.json",JSON.stringify({globals:json.global_modifiers,flags:json.gameplay_flags,population_cap:json.population_cap},null,2));
        if(Object.keys(json.age_modifications).length)att.file("age_costs.json",JSON.stringify(json.age_modifications,null,2));
        if(Object.keys(json.technology_modifications).length)att.file("technologies.json",JSON.stringify(json.technology_modifications,null,2));
        if(Object.keys(json.landmark_modifications).length)att.file("landmarks.json",JSON.stringify(json.landmark_modifications,null,2));
        zip.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:6}})
          .then(blob=>{const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`${folder}-v${meta.version}.zip`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);showToast(`✅ ${totalChanges} changes exported!`,"success");})
          .catch(err=>showToast("❌ ZIP error: "+err.message,"error"))
          .finally(()=>setExporting(false));
      }catch(err){showToast("❌ Export failed: "+err.message,"error");setExporting(false);}
    };
    if(window.JSZip||jsZipLoaded.current){jsZipLoaded.current=true;doExport();return;}
    const sc=document.createElement("script");sc.src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";sc.onload=()=>{jsZipLoaded.current=true;doExport();};sc.onerror=()=>{showToast("❌ Could not load JSZip","error");setExporting(false);};document.head.appendChild(sc);
  };

  const changeLog=useMemo(()=>{
    const items=[];
    UNITS.forEach(u=>{const m=unitMods[u.id];if(!m)return;[["hp","HP"],["atk","ATK"],["spd","Speed"],["armor","Armor"],["aspd","Atk Speed"],["range","Range"]].forEach(([k,lbl])=>{if(Math.abs((m[k]||1)-1)>0.01){const p=Math.round(((m[k]||1)-1)*100);items.push({icon:u.icon,text:`${u.name}: ${lbl} ${p>0?"▲ +":"▼ "}${Math.abs(p)}%`,type:p>0?"buff":"nerf"});}});});
    CIVS.forEach(c=>{if(!isCivMod(c.id))return;const m=getCM(c.id);const unit=c.bonusName.includes("interval")?"s":"%";items.push({icon:c.flag,text:`${c.name}: ${c.bonusName} → ${m.bonus}${unit}${m.disabled?" [DISABLED]":""}`,type:m.disabled?"nerf":m.bonus>c.base?"buff":"nerf"});});
    ["gF","gW","gG","gS"].forEach((k,i)=>{const names=["Food","Wood","Gold","Stone"];const icons=["🌾","🪵","💎","🪨"];if(Math.abs(res[k]-1)>0.01)items.push({icon:icons[i],text:`${names[i]} gather: ${res[k].toFixed(2)}×`,type:res[k]>1?"buff":"nerf"});});
    ["cF","cW","cG","cS"].forEach((k,i)=>{const names=["Food","Wood","Gold","Stone"];const icons=["🌾","🪵","💎","🪨"];if(Math.abs(res[k]-1)>0.01)items.push({icon:icons[i],text:`${names[i]} carry: ${res[k].toFixed(2)}×`,type:res[k]>1?"buff":"nerf"});});
    if(globals.popCap!==200)items.push({icon:"👥",text:`Population cap: ${globals.popCap}`,type:globals.popCap>200?"buff":"nerf"});
    ["unitHpMult","unitAtkMult","unitSpdMult","bldgHpMult","trainMult","techMult","gatherMult"].forEach(k=>{if(Math.abs(globals[k]-1)>0.01){const lbl={unitHpMult:"Global Unit HP",unitAtkMult:"Global Unit ATK",unitSpdMult:"Global Unit Speed",bldgHpMult:"Global Building HP",trainMult:"Global Train Time",techMult:"Global Tech Time",gatherMult:"Global Gather Rate"}[k];const p=Math.round((globals[k]-1)*100);items.push({icon:"🌐",text:`${lbl}: ${globals[k].toFixed(2)}×`,type:p>0?"buff":"nerf"});}});
    Object.entries(flags).forEach(([k,v])=>{if(v){const lbl={infiniteRes:"Infinite Resources",noFog:"No Fog of War",noWonder:"No Wonder Victory",instantTrain:"Instant Training",instantTech:"Instant Research",noPop:"No Pop Cost",allAge1:"All Units Dark Age",symCivs:"Symmetric Civs"}[k];items.push({icon:"🚩",text:lbl,type:"flag"});}});
    return items;
  },[unitMods,unitTrain,bldgMods,civMods,ageMods,techMods,lmMods,res,globals,flags,getCM,isCivMod]);

  const P=useMemo(()=>{const Comp=(props)=><Panel {...props} collapsed={collapsed} toggleP={toggleP}/>;return Comp;},[collapsed,toggleP]);
  const slugName=(meta.name||"my-mod").replace(/[^a-zA-Z0-9\-_]/g,"-").toLowerCase();
  const filteredUnits=UNITS.filter(u=>(unitFilter==="all"||u.cat===unitFilter)&&u.name.toLowerCase().includes(unitSearch.toLowerCase()));
  const filteredBldgs=BUILDINGS.filter(b=>bldgFilter==="all"||b.cat===bldgFilter);

  const renderUnitEditor=()=>{
    const u=UNITS.find(x=>x.id===selUnit);
    if(!u)return(<div style={{...mk.panel,padding:36,textAlign:"center"}}><div style={{fontSize:38,marginBottom:10}}>⚔️</div><div style={{color:C.text3,fontStyle:"italic"}}>Select a unit on the left to edit</div></div>);
    const m=getUM(u.id);const tm=getUTM(u.id);
    const statDefs=[
      {key:"hp",   label:"Hit Points",    baseDisplay:u.hp,   min:0.1,max:5,  step:0.05,fmt:v=>Math.round(u.hp*v),                        dis:false},
      {key:"atk",  label:"Attack Damage", baseDisplay:u.atk,  min:0.1,max:5,  step:0.05,fmt:v=>u.atk===0?"0":Math.round(u.atk*v),         dis:u.atk===0},
      {key:"aspd", label:"Atk Speed (s)", baseDisplay:u.aspd, min:0.2,max:4,  step:0.05,fmt:v=>u.aspd===0?"—":(u.aspd*v).toFixed(2)+"s",  dis:u.aspd===0},
      {key:"spd",  label:"Move Speed",    baseDisplay:u.spd,  min:0.3,max:3,  step:0.05,fmt:v=>(u.spd*v).toFixed(2),                      dis:false},
      {key:"armor",label:"Armor",         baseDisplay:u.armor,min:0.5,max:5,  step:0.1, fmt:v=>u.armor===0?"—":(u.armor*v).toFixed(1),    dis:u.armor===0},
      {key:"range",label:"Attack Range",  baseDisplay:u.range,min:0.5,max:3,  step:0.1, fmt:v=>u.range===0?"Melee":(u.range*v).toFixed(1),dis:u.range===0},
    ];
    return(
      <P id={`u-ed-${selUnit}`} icon={u.icon} title={u.name} badge={isUnitMod(u.id)?"Modified":null}>
        <div style={{display:"flex",gap:5,marginBottom:9,flexWrap:"wrap"}}>
          <Badge color="gold">{u.cat}</Badge>
          <Badge color="blue">Base HP: {u.hp}</Badge>
          <Badge color="blue">Base ATK: {u.atk}</Badge>
        </div>
        <div style={{fontSize:10,color:C.text3,marginBottom:6,fontStyle:"italic"}}>⚔️ Combat Statistics</div>
        <div style={mk.g2}>{statDefs.map(d=><StatSlider key={d.key} label={d.label} value={m[d.key]} baseDisplay={d.baseDisplay} min={d.min} max={d.max} step={d.step} fmt={d.fmt} disabled={d.dis} mode="mult" onChange={v=>setUS(u.id,d.key,v)}/>)}</div>
        <hr style={mk.div}/>
        <div style={{fontSize:10,color:C.text3,marginBottom:6,fontStyle:"italic"}}>🛠️ Training Cost & Time</div>
        <div style={mk.g3}>
          <NumInput icon="🌾" label="Food Cost"     value={tm.trainCostF} onChange={v=>setUTS(u.id,"trainCostF",v)}/>
          <NumInput icon="💎" label="Gold Cost"     value={tm.trainCostG} onChange={v=>setUTS(u.id,"trainCostG",v)}/>
          <NumInput icon="⏱️" label="Train Time (s)" value={tm.trainTime} min={1} max={999} onChange={v=>setUTS(u.id,"trainTime",v)}/>
        </div>
        <div style={{display:"flex",gap:7,marginTop:10}}>
          <Btn variant="danger" onClick={()=>{setUnitMods(p=>{const n={...p};delete n[u.id];return n;});setUnitTrain(p=>{const n={...p};delete n[u.id];return n;});showToast("↩ Unit reset");}}>↩ Reset Unit</Btn>
        </div>
      </P>
    );
  };

  return(
    <div style={mk.app}>
      <header style={mk.hdr}>
        <div style={mk.hdrIn}>
          <div style={mk.emblem}>⚔️</div>
          <div style={{flexShrink:0}}>
            <div style={{fontFamily:"Georgia,serif",fontSize:13,fontWeight:"bold",color:C.gold2,letterSpacing:2,textTransform:"uppercase"}}>Forge of Empires</div>
            <div style={{fontSize:9,color:C.text3,letterSpacing:2}}>AoE IV MOD BUILDER v4</div>
          </div>
          <div style={{width:1,height:24,background:C.border,margin:"0 4px"}}/>
          <div style={mk.tabBar}>{TABS.map(([id,lbl])=><div key={id} style={mk.tab(tab===id)} onClick={()=>setTab(id)}>{lbl}</div>)}</div>
          <div style={{display:"flex",gap:7,alignItems:"center",marginLeft:"auto",flexShrink:0}}>
            <Badge color={totalChanges>0?"green":"gold"}>{totalChanges} changes</Badge>
            <Btn variant="secondary" style={{fontSize:9,padding:"4px 10px"}} onClick={resetAll}>↩ Reset All</Btn>
            <Btn variant="export" onClick={exportMod} style={{opacity:exporting?0.6:1}}>{exporting?"⏳ Exporting...":"⬇ Export ZIP"}</Btn>
          </div>
        </div>
      </header>

      <div style={mk.body}>
        {tab==="meta"&&<div>
          <div style={mk.stitle}>📋 Mod Information</div>
          <div style={mk.ssub}>Set your mod's identity before configuring gameplay changes</div>
          <div style={mk.g2}>
            <P id="p-id" icon="🪪" title="Identity">
              {[["Mod Name","name","My AoE4 Mod"],["Version","version","1.0.0"],["Author","author","Your name"]].map(([l,k,ph])=>(
                <div key={k} style={{marginBottom:9}}><label style={mk.lbl}>{l}</label><input style={mk.inp} value={meta[k]} placeholder={ph} onChange={e=>setMeta(p=>({...p,[k]:e.target.value}))}/></div>
              ))}
              <div style={{marginBottom:9}}><label style={mk.lbl}>Description</label><textarea style={mk.ta} value={meta.desc} placeholder="What does your mod change?" onChange={e=>setMeta(p=>({...p,desc:e.target.value}))}/></div>
              <div><label style={mk.lbl}>Tags (comma separated)</label><input style={mk.inp} value={meta.tags} onChange={e=>setMeta(p=>({...p,tags:e.target.value}))}/></div>
            </P>
            <div>
              <P id="p-compat" icon="⚙️" title="Compatibility">
                <Toggle on={meta.mp}       onChange={v=>setMeta(p=>({...p,mp:v}))}       label="Multiplayer Required"  desc="Both players need this mod"/>
                <Toggle on={meta.campaign} onChange={v=>setMeta(p=>({...p,campaign:v}))} label="Campaign Compatible"   desc="Apply to campaign missions"/>
                <Toggle on={meta.skirmish} onChange={v=>setMeta(p=>({...p,skirmish:v}))} label="Skirmish Compatible"   desc="Apply to vs AI skirmish" last/>
              </P>
              <P id="p-stats" icon="📊" title="Mod Stats">
                {[["Total changes",totalChanges],["Units modified",`${Object.keys(unitMods).length} / ${UNITS.length}`],["Buildings modified",`${Object.keys(bldgMods).length} / ${BUILDINGS.length}`],["Civs modified",`${Object.keys(civMods).length} / ${CIVS.length}`],["Techs modified",`${Object.keys(techMods).length} / ${TECHS.length}`],["Landmarks modified",`${Object.keys(lmMods).length} / ${LANDMARKS.length}`],["Flags active",Object.values(flags).filter(Boolean).length]].map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid rgba(58,46,26,0.3)`,fontSize:12}}>
                    <span style={{color:C.text3}}>{k}</span><span style={{color:C.gold2,fontWeight:"bold"}}>{v}</span>
                  </div>
                ))}
              </P>
            </div>
          </div>
        </div>}

        {tab==="presets"&&<div>
          <div style={mk.stitle}>⚡ Quick Presets</div>
          <div style={mk.ssub}>Apply a gameplay template as a starting point, then fine-tune in other tabs</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10}}>
            {PRESETS.map(p=>(
              <div key={p.id} style={{...mk.panel,cursor:"pointer"}} onClick={()=>applyPreset(p.id)}>
                <div style={{padding:"16px 12px",textAlign:"center"}}>
                  <div style={{fontSize:32,marginBottom:7}}>{p.icon}</div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:13,color:C.gold2,marginBottom:4}}>{p.name}</div>
                  <div style={{fontSize:11,color:C.text3,fontStyle:"italic",marginBottom:11}}>{p.desc}</div>
                  <Btn variant="ghost" style={{fontSize:9,padding:"3px 11px"}}>Apply</Btn>
                </div>
              </div>
            ))}
          </div>
          <div style={{...mk.help,marginTop:12}}>💡 Presets stack — apply one then tweak in other tabs, or layer multiple presets in sequence.</div>
        </div>}

        {tab==="globals"&&<div>
          <div style={mk.stitle}>🌐 Global Multipliers</div>
          <div style={mk.ssub}>Apply multipliers across ALL units or buildings simultaneously</div>
          <div style={mk.help}>⚠️ Global multipliers stack with per-unit changes. Unit with ×1.5 HP + unitHpMult=2.0 = ×3.0 HP total.</div>
          <div style={mk.g2}>
            <P id="g-u" icon="⚔️" title="Unit Globals">
              {[{k:"unitHpMult",l:"All Unit HP"},{k:"unitAtkMult",l:"All Unit Attack"},{k:"unitSpdMult",l:"All Unit Speed"},{k:"trainMult",l:"All Train Time"}].map(d=>(
                <StatSlider key={d.k} label={d.l+" Multiplier"} value={globals[d.k]} baseDisplay={1} min={0.1} max={5} step={0.05} fmt={v=>`${v.toFixed(2)}×`} mode="mult" onChange={v=>setGlobals(p=>({...p,[d.k]:v}))}/>
              ))}
            </P>
            <P id="g-e" icon="💰" title="Economy & Research Globals">
              {[{k:"bldgHpMult",l:"All Building HP"},{k:"gatherMult",l:"All Gather Rates"},{k:"techMult",l:"All Tech Times"}].map(d=>(
                <StatSlider key={d.k} label={d.l+" Multiplier"} value={globals[d.k]} baseDisplay={1} min={0.1} max={5} step={0.05} fmt={v=>`${v.toFixed(2)}×`} mode="mult" onChange={v=>setGlobals(p=>({...p,[d.k]:v}))}/>
              ))}
              <hr style={mk.div}/>
              <div><label style={mk.lbl}>Population Cap <span style={{color:C.gold}}>(default 200, range 50–1000)</span></label>
                <input type="number" style={mk.inp} value={globals.popCap} min={50} max={1000} onChange={e=>setGlobals(p=>({...p,popCap:Math.max(50,Math.min(1000,parseInt(e.target.value)||200))}))}/>
              </div>
            </P>
          </div>
        </div>}

        {tab==="units"&&<div>
          <div style={mk.stitle}>⚔️ Unit Statistics</div>
          <div style={mk.ssub}>Edit combat stats and training for all {UNITS.length} units — green dot = modified</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,alignItems:"start"}}>
            <div>
              <div style={{display:"flex",gap:5,marginBottom:8,flexWrap:"wrap"}}>
                {[["all","All"],["infantry","⚔️ Infantry"],["cavalry","🐴 Cavalry"],["ranged","🏹 Ranged"],["siege","💣 Siege"],["naval","⚓ Naval"]].map(([f,l])=>(
                  <Btn key={f} variant={unitFilter===f?"primary":"secondary"} style={{fontSize:9,padding:"3px 8px"}} onClick={()=>setUnitFilter(f)}>{l}</Btn>
                ))}
              </div>
              <input style={{...mk.inp,marginBottom:8}} placeholder="🔍 Search units..." value={unitSearch} onChange={e=>setUnitSearch(e.target.value)}/>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(78px,1fr))",gap:5}}>
                {filteredUnits.map(u=>{
                  const mod=isUnitMod(u.id);const sel=selUnit===u.id;
                  return(
                    <div key={u.id} style={{padding:"7px 5px",background:sel?"rgba(200,168,75,0.1)":"rgba(0,0,0,0.5)",border:`1px solid ${sel?C.gold:mod?C.green:C.border}`,borderRadius:5,cursor:"pointer",textAlign:"center",position:"relative",transition:"all 0.15s"}} onClick={()=>setSelUnit(u.id)}>
                      {mod&&<div style={{position:"absolute",top:3,left:4,width:5,height:5,background:C.green,borderRadius:"50%"}}/>}
                      {sel&&<div style={{position:"absolute",top:3,right:5,color:C.gold,fontSize:8}}>✓</div>}
                      <div style={{fontSize:19,marginBottom:2}}>{u.icon}</div>
                      <div style={{fontSize:9,fontFamily:"Georgia,serif",color:sel?C.gold2:C.text2,lineHeight:1.2}}>{u.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>{renderUnitEditor()}</div>
          </div>
        </div>}

        {tab==="buildings"&&<div>
          <div style={mk.stitle}>🏰 Buildings</div>
          <div style={mk.ssub}>Construction costs, build time, HP, and garrison for all {BUILDINGS.length} buildings</div>
          <div style={{display:"flex",gap:5,marginBottom:10,flexWrap:"wrap"}}>
            {[["all","All"],["core","🏘️ Core"],["military","⚔️ Military"],["economy","💰 Economy"],["defensive","🛡️ Defensive"],["naval","⚓ Naval"],["research","🔬 Research"],["wonder","✨ Wonder"]].map(([f,l])=>(
              <Btn key={f} variant={bldgFilter===f?"primary":"secondary"} style={{fontSize:9,padding:"3px 8px"}} onClick={()=>setBldgFilter(f)}>{l}</Btn>
            ))}
          </div>
          {filteredBldgs.map(b=>{
            const m=getBM(b.id);const mod=isBldgMod(b.id);
            return(
              <P key={b.id} id={`b-${b.id}`} icon={b.icon} title={b.name} badge={mod?"Modified":null} defaultOpen={false}>
                <div style={mk.g2}>
                  <div>
                    <div style={{...mk.lbl,marginBottom:7}}>Construction Cost</div>
                    <div style={mk.g4}>
                      <NumInput icon="🌾" label="Food"  value={m.food}  onChange={v=>setBS(b.id,"food",v)}/>
                      <NumInput icon="🪵" label="Wood"  value={m.wood}  onChange={v=>setBS(b.id,"wood",v)}/>
                      <NumInput icon="💎" label="Gold"  value={m.gold}  onChange={v=>setBS(b.id,"gold",v)}/>
                      <NumInput icon="🪨" label="Stone" value={m.stone} onChange={v=>setBS(b.id,"stone",v)}/>
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:9}}>
                    <StatSlider label="Build Time (s)" value={m.time}     baseDisplay={b.time}     min={3}   max={Math.max(b.time*5,300)}  step={5}   fmt={v=>v+"s"} mode="raw" onChange={v=>setBS(b.id,"time",v)}/>
                    <StatSlider label="Hit Points"     value={m.hp}       baseDisplay={b.hp}       min={100} max={Math.max(b.hp*4,10000)} step={100} fmt={v=>v}     mode="raw" onChange={v=>setBS(b.id,"hp",v)}/>
                    {b.garrison>0&&<StatSlider label="Garrison" value={m.garrison} baseDisplay={b.garrison} min={0} max={Math.max(b.garrison*4,40)} step={1} fmt={v=>v} mode="raw" onChange={v=>setBS(b.id,"garrison",v)}/>}
                  </div>
                </div>
                {mod&&<Btn variant="danger" style={{fontSize:9,padding:"3px 9px",marginTop:9}} onClick={()=>setBldgMods(p=>{const n={...p};delete n[b.id];return n;})}>↩ Reset</Btn>}
              </P>
            );
          })}
        </div>}

        {tab==="civs"&&<div>
          <div style={mk.stitle}>🏛️ Civilization Bonuses</div>
          <div style={mk.ssub}>Tune bonus values or disable them for any of the {CIVS.length} civilizations</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))",gap:6,marginBottom:14}}>
            {CIVS.map(c=>(
              <div key={c.id} style={{padding:"9px 7px",background:selCiv===c.id?"rgba(200,168,75,0.1)":"rgba(0,0,0,0.4)",border:`1px solid ${selCiv===c.id?C.gold:isCivMod(c.id)?C.green:C.border}`,borderRadius:5,cursor:"pointer",textAlign:"center",transition:"all 0.15s"}} onClick={()=>setSelCiv(c.id)}>
                <div style={{fontSize:22,marginBottom:4}}>{c.flag}</div>
                <div style={{fontSize:9,fontFamily:"Georgia,serif",color:selCiv===c.id?C.gold2:C.text2,lineHeight:1.2}}>{c.name}</div>
                {isCivMod(c.id)&&<Badge color="green" style={{margin:"3px auto 0",fontSize:7}}>mod</Badge>}
              </div>
            ))}
          </div>
          {selCiv&&(()=>{
            const c=CIVS.find(x=>x.id===selCiv);const m=getCM(c.id);
            const bonusChanged=m.bonus!==c.base;
            const pct=c.base!==0?Math.round(((m.bonus-c.base)/Math.abs(c.base))*100):m.bonus;
            const isInterval=c.bonusName.includes("interval");const unit=isInterval?"s":"%";
            return(
              <div key={selCiv}>
                <P id={`civ-ed-${selCiv}`} icon={c.flag} title={`${c.name} — ${c.bonusName}`} badge={isCivMod(c.id)?"Modified":null}>
                  <div style={mk.g2}>
                    <div style={mk.sc}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <span style={{fontSize:10,color:C.text2}}>{c.bonusName}</span>
                        <div style={{display:"flex",gap:4,alignItems:"center"}}>
                          <span style={{fontSize:9,color:C.text3}}>base: {c.base}{unit}</span>
                          <span style={{display:"inline-flex",alignItems:"center",padding:"1px 7px",borderRadius:10,fontSize:9,background:bonusChanged?`rgba(${m.bonus>c.base?"64,160,96":"200,64,48"},0.15)`:"rgba(200,168,75,0.15)",color:bonusChanged?(m.bonus>c.base?C.green:C.red):C.gold,border:"1px solid #44444444",minWidth:36,justifyContent:"center"}}>{m.bonus}{unit}</span>
                        </div>
                      </div>
                      <input type="range" min={c.minVal} max={c.maxVal} step={1} value={m.bonus} onChange={e=>setCivMods(p=>({...p,[c.id]:{...getCM(c.id),bonus:parseInt(e.target.value)}}))} style={{width:"100%",accentColor:C.gold}}/>
                      <div style={{textAlign:"right",fontSize:9,height:11,color:bonusChanged?(m.bonus>c.base?C.green:C.red):C.text3}}>
                        {!bonusChanged?"Base":c.base!==0?`${m.bonus>c.base?"▲":"▼"} ${Math.abs(pct)}% from base`:`${m.bonus>0?"▲":"▼"} ${Math.abs(m.bonus)} from zero`}
                      </div>
                      <div style={{fontSize:10,color:C.text3,fontStyle:"italic",marginTop:2}}>{c.bonusDesc}</div>
                    </div>
                    <div>
                      <Toggle on={m.disabled} onChange={v=>setCivMods(p=>({...p,[c.id]:{...getCM(c.id),disabled:v}}))} label="Disable This Bonus" desc="Removes the bonus entirely" last/>
                      <div style={{marginTop:9}}>
                        <label style={mk.lbl}>Custom Description (optional)</label>
                        <input style={mk.inp} placeholder="Override tooltip text..." value={m.customDesc||""} onChange={e=>setCivMods(p=>({...p,[c.id]:{...getCM(c.id),customDesc:e.target.value}}))}/>
                      </div>
                      {isCivMod(c.id)&&<Btn variant="danger" style={{fontSize:9,padding:"3px 9px",marginTop:9}} onClick={()=>setCivMods(p=>{const n={...p};delete n[c.id];return n;})}>↩ Reset Civ</Btn>}
                    </div>
                  </div>
                </P>
              </div>
            );
          })()}
        </div>}

        {tab==="resources"&&<div>
          <div style={mk.stitle}>💰 Resource Economy</div>
          <div style={mk.ssub}>Gathering rates, carry capacity, starting resources, and trade</div>
          <div style={mk.g2}>
            <div>
              <P id="r-g" icon="🌾" title="Gather Rate Multipliers">
                {[["gF","🌾","Food"],["gW","🪵","Wood"],["gG","💎","Gold"],["gS","🪨","Stone"]].map(([k,ic,lbl])=>(
                  <div key={k} style={{display:"grid",gridTemplateColumns:"110px 1fr 52px 52px",alignItems:"center",gap:7,padding:"6px 0",borderBottom:`1px solid rgba(58,46,26,0.3)`}}>
                    <span style={{fontSize:13,color:C.text2}}>{ic} {lbl}</span>
                    <input type="range" min={0.1} max={5} step={0.05} value={res[k]} onChange={e=>setRes(p=>({...p,[k]:parseFloat(e.target.value)}))} style={{accentColor:C.gold}}/>
                    <Badge color={res[k]>1.01?"green":res[k]<0.99?"red":"gold"} style={{justifyContent:"center"}}>{res[k].toFixed(2)}×</Badge>
                    <span style={{fontSize:9,color:res[k]>1.01?C.green:res[k]<0.99?C.red:C.text3,textAlign:"right"}}>{res[k]>1.01?`+${Math.round((res[k]-1)*100)}%`:res[k]<0.99?`${Math.round((res[k]-1)*100)}%`:"base"}</span>
                  </div>
                ))}
              </P>
              <P id="r-c" icon="🎒" title="Carry Capacity Multipliers">
                {[["cF","🌾","Food"],["cW","🪵","Wood"],["cG","💎","Gold"],["cS","🪨","Stone"]].map(([k,ic,lbl])=>(
                  <div key={k} style={{display:"grid",gridTemplateColumns:"110px 1fr 52px 52px",alignItems:"center",gap:7,padding:"6px 0",borderBottom:`1px solid rgba(58,46,26,0.3)`}}>
                    <span style={{fontSize:13,color:C.text2}}>{ic} {lbl}</span>
                    <input type="range" min={0.1} max={5} step={0.05} value={res[k]} onChange={e=>setRes(p=>({...p,[k]:parseFloat(e.target.value)}))} style={{accentColor:C.gold}}/>
                    <Badge color={res[k]>1.01?"green":res[k]<0.99?"red":"gold"} style={{justifyContent:"center"}}>{res[k].toFixed(2)}×</Badge>
                    <span style={{fontSize:9,color:res[k]>1.01?C.green:res[k]<0.99?C.red:C.text3,textAlign:"right"}}>{res[k]>1.01?`+${Math.round((res[k]-1)*100)}%`:res[k]<0.99?`${Math.round((res[k]-1)*100)}%`:"base"}</span>
                  </div>
                ))}
              </P>
            </div>
            <div>
              <P id="r-s" icon="🏁" title="Starting Resources">
                <div style={mk.g2}>
                  <NumInput icon="🌾" label="Food (default 200)"  value={res.sF} onChange={v=>setRes(p=>({...p,sF:v}))}/>
                  <NumInput icon="🪵" label="Wood (default 150)"  value={res.sW} onChange={v=>setRes(p=>({...p,sW:v}))}/>
                  <NumInput icon="💎" label="Gold (default 100)"  value={res.sG} onChange={v=>setRes(p=>({...p,sG:v}))}/>
                  <NumInput icon="🪨" label="Stone (default 200)" value={res.sS} onChange={v=>setRes(p=>({...p,sS:v}))}/>
                </div>
              </P>
              <P id="r-t" icon="🏪" title="Trade Income">
                <div style={{display:"grid",gridTemplateColumns:"140px 1fr 52px",alignItems:"center",gap:7,padding:"6px 0"}}>
                  <span style={{fontSize:12,color:C.text2}}>Trade Multiplier</span>
                  <input type="range" min={0.1} max={5} step={0.05} value={res.tradeMult} onChange={e=>setRes(p=>({...p,tradeMult:parseFloat(e.target.value)}))} style={{accentColor:C.gold}}/>
                  <Badge color={res.tradeMult>1.01?"green":res.tradeMult<0.99?"red":"gold"} style={{justifyContent:"center"}}>{res.tradeMult.toFixed(2)}×</Badge>
                </div>
              </P>
            </div>
          </div>
        </div>}

        {tab==="ages"&&<div>
          <div style={mk.stitle}>📜 Age Advance Costs</div>
          <div style={mk.ssub}>Modify cost, research time, and population requirements per age transition</div>
          {AGES.map(a=>{const m=getAM(a.id);return(
            <P key={a.id} id={`age-${a.id}`} icon={a.icon} title={a.name}>
              <div style={mk.g3}>
                <StatSlider label="Cost (Food)" value={m.cost} baseDisplay={a.baseCost} min={Math.max(50,Math.round(a.baseCost*0.1))} max={a.baseCost*5} step={50} fmt={v=>v} mode="raw" onChange={v=>setAgeMods(p=>({...p,[a.id]:{...getAM(a.id),cost:Math.round(v)}}))}/>
                <StatSlider label="Research Time (s)" value={m.time} baseDisplay={a.baseTime} min={5} max={a.baseTime*5} step={5} fmt={v=>v+"s"} mode="raw" onChange={v=>setAgeMods(p=>({...p,[a.id]:{...getAM(a.id),time:Math.round(v)}}))}/>
                <StatSlider label="Pop Required" value={m.popReq} baseDisplay={a.basePopReq} min={0} max={80} step={1} fmt={v=>v+" pop"} mode="raw" onChange={v=>setAgeMods(p=>({...p,[a.id]:{...getAM(a.id),popReq:Math.round(v)}}))}/>
              </div>
            </P>
          );})}
        </div>}

        {tab==="techs"&&<div>
          <div style={mk.stitle}>🔬 Technology Research</div>
          <div style={mk.ssub}>Adjust research costs and time for all {TECHS.length} technologies</div>
          {["economy","military","naval"].map(cat=>{
            const techs=TECHS.filter(t=>t.cat===cat);if(!techs.length)return null;
            return(
              <P key={cat} id={`tc-${cat}`} icon={cat==="economy"?"💰":cat==="naval"?"⚓":"⚔️"} title={cat.charAt(0).toUpperCase()+cat.slice(1)+" Technologies"}>
                <div style={mk.g2}>
                  {techs.map(t=>{
                    const m=getTM(t.id);const mod=isTechMod(t.id);
                    return(
                      <div key={t.id} style={{...mk.sc,border:`1px solid ${mod?C.green:C.border}`}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                          <span style={{fontSize:12,color:C.gold2}}>{t.icon} {t.name}</span>
                          <Badge color="gold" style={{fontSize:8}}>{t.effect}</Badge>
                        </div>
                        <div style={mk.g2}>
                          {[["costF","🌾 Food",t.costF],["costG","💎 Gold",t.costG]].map(([k,lbl,base])=>(
                            <div key={k}><label style={mk.lbl}>{lbl} <span style={{color:m[k]!==base?C.green:C.text3}}>(base:{base})</span></label>
                              <input type="number" style={mk.inpSm} value={m[k]} min={0} onChange={e=>setTechMods(p=>({...p,[t.id]:{...getTM(t.id),[k]:Math.max(0,parseInt(e.target.value)||0)}}))}/>
                            </div>
                          ))}
                        </div>
                        <StatSlider label="Research Time (s)" value={m.time} baseDisplay={t.time} min={5} max={Math.max(t.time*5,250)} step={5} fmt={v=>v+"s"} mode="raw" onChange={v=>setTechMods(p=>({...p,[t.id]:{...getTM(t.id),time:Math.round(v)}}))}/>
                        {mod&&<Btn variant="danger" style={{fontSize:8,padding:"2px 8px",marginTop:5}} onClick={()=>setTechMods(p=>{const n={...p};delete n[t.id];return n;})}>↩ Reset</Btn>}
                      </div>
                    );
                  })}
                </div>
              </P>
            );
          })}
        </div>}

        {tab==="landmarks"&&<div>
          <div style={mk.stitle}>🗺️ Landmarks</div>
          <div style={mk.ssub}>Modify HP and construction costs of all {LANDMARKS.length} age-up landmarks</div>
          <div style={mk.help}>Changing HP makes landmarks more/less defensible. Changing costs shifts age-up economics.</div>
          {CIVS.map(civ=>{
            const civLMs=LANDMARKS.filter(l=>l.civ===civ.id);if(!civLMs.length)return null;
            return(
              <P key={civ.id} id={`lm-${civ.id}`} icon={civ.flag} title={civ.name+" Landmarks"} defaultOpen={false}>
                {civLMs.map(l=>{
                  const m=getLM(l.id);const base=LANDMARKS.find(x=>x.id===l.id);
                  const mod=Object.keys(m).some(k=>m[k]!==base[k]);
                  return(
                    <div key={l.id} style={{...mk.sc,marginBottom:9,border:`1px solid ${mod?C.green:C.border}`}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                        <span style={{fontSize:13,color:C.gold2}}>{l.icon} {l.name}</span>
                        {mod&&<Badge color="green">Modified</Badge>}
                      </div>
                      <div style={mk.g2}>
                        <StatSlider label="Hit Points" value={m.hp} baseDisplay={base.hp} min={500} max={Math.max(base.hp*4,20000)} step={250} fmt={v=>v} mode="raw" onChange={v=>setLmMods(p=>({...p,[l.id]:{...getLM(l.id),hp:Math.round(v)}}))}/>
                        <div style={mk.g4}>
                          {[["food","🌾"],["wood","🪵"],["gold","💎"],["stone","🪨"]].map(([k,ic])=>(
                            <NumInput key={k} icon={ic} label={k.charAt(0).toUpperCase()+k.slice(1)} value={m[k]} onChange={v=>setLmMods(p=>({...p,[l.id]:{...getLM(l.id),[k]:v}}))}/>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </P>
            );
          })}
        </div>}

        {tab==="flags"&&<div>
          <div style={mk.stitle}>🚩 Gameplay Flags</div>
          <div style={mk.ssub}>Toggle major gameplay systems on or off</div>
          <div style={mk.help}>⚠️ These make sweeping changes. Extreme combos like "Instant Train + Infinite Resources" will destroy balance.</div>
          <P id="gf" icon="🚩" title="Gameplay Toggles">
            {[["infiniteRes","♾️ Infinite Resources","Resource nodes never deplete"],["noFog","👁️ No Fog of War","Full map visible from game start"],["noWonder","🚫 Disable Wonder Victory","Removes wonder win condition"],["instantTrain","⚡ Instant Unit Training","All units train in 1 second"],["instantTech","⚡ Instant Research","All technologies complete in 1 second"],["noPop","🔢 No Population Cost","Units cost 0 population"],["allAge1","🔓 All Units in Dark Age","Removes age requirements for units"],["symCivs","⚖️ Symmetric Civ Bonuses","All civs receive identical bonuses"]].map(([k,l,d],i,arr)=>(
              <Toggle key={k} on={flags[k]} onChange={v=>setFlags(p=>({...p,[k]:v}))} label={l} desc={d} last={i===arr.length-1}/>
            ))}
          </P>
        </div>}

        {tab==="changelog"&&<div>
          <div style={mk.stitle}>📝 Active Changes</div>
          <div style={mk.ssub}>All {totalChanges} modifications currently configured in this mod</div>
          {totalChanges===0
            ?<div style={{...mk.panel,padding:36,textAlign:"center"}}><div style={{fontSize:36,marginBottom:10}}>📝</div><div style={{color:C.text3,fontStyle:"italic"}}>No changes yet — go to any tab to start modding!</div></div>
            :<P id="cl" icon="📝" title={`${totalChanges} Active Changes`}>
              {changeLog.map((item,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 8px",background:"rgba(0,0,0,0.3)",borderLeft:`3px solid ${item.type==="buff"?C.green:item.type==="nerf"?C.red:C.blue}`,marginBottom:4,borderRadius:"0 4px 4px 0",fontSize:12}}>
                  <span>{item.icon}</span>
                  <span style={{color:C.text2,flex:1}}>{item.text}</span>
                  <Badge color={item.type==="buff"?"green":item.type==="nerf"?"red":"blue"} style={{fontSize:8,flexShrink:0}}>{item.type}</Badge>
                </div>
              ))}
            </P>
          }
        </div>}

        {tab==="install"&&<div>
          <div style={mk.stitle}>📖 Installation Guide</div>
          <div style={mk.ssub}>Step-by-step guide to installing your mod in Age of Empires IV</div>
          <P id="ig-1" icon="1️⃣" title="Step 1 — Export Your Mod">
            <div style={{fontSize:13,color:C.text2,lineHeight:1.8}}>Click <span style={{color:C.gold,fontWeight:"bold"}}>⬇ Export ZIP</span> in the top-right corner. This downloads <code style={{background:"rgba(0,0,0,0.4)",padding:"1px 6px",borderRadius:3,fontSize:12,color:C.gold2}}>{slugName}-v{meta.version}.zip</code></div>
            <div style={{...mk.help,marginTop:10,marginBottom:0}}>Contains <b style={{color:C.gold}}>mod.json</b>, <b style={{color:C.gold}}>modinfo.json</b>, <b style={{color:C.gold}}>README.txt</b>, and an <b style={{color:C.gold}}>attrib/</b> folder with per-category JSON files.</div>
          </P>
          <P id="ig-2" icon="2️⃣" title="Step 2 — Find Your Mods Folder">
            {[["🪟 Windows (standard)","C:\\Users\\[YourName]\\Games\\Age of Empires IV\\mods\\local\\"],["🎮 Steam (userdata)","C:\\Program Files (x86)\\Steam\\userdata\\[SteamID]\\1466860\\local\\"],["🎮 Xbox Game Pass","C:\\Users\\[YourName]\\AppData\\Local\\Packages\\...AgeOfEmpires4...\\LocalCache\\local\\mods\\local\\"]].map(([label,path])=>(
              <div key={label} style={{background:"rgba(0,0,0,0.4)",border:`1px solid ${C.border}`,borderRadius:5,padding:"9px 12px",marginBottom:6}}>
                <div style={{fontSize:11,color:C.gold,marginBottom:4}}>{label}</div>
                <code style={{fontSize:11,color:C.text2,wordBreak:"break-all"}}>{path}</code>
              </div>
            ))}
            <div style={{...mk.help,marginTop:6,marginBottom:0}}>💡 Press <code style={{background:"rgba(0,0,0,0.4)",padding:"1px 5px",borderRadius:3}}>Win + R</code> and paste <code style={{background:"rgba(0,0,0,0.4)",padding:"1px 5px",borderRadius:3}}>%USERPROFILE%\Games\Age of Empires IV\mods\local</code> to jump there instantly.</div>
          </P>
          <P id="ig-3" icon="3️⃣" title="Step 3 — Extract the ZIP">
            <div style={{fontSize:13,color:C.text2,lineHeight:1.8}}>Extract your ZIP into the <b style={{color:C.gold}}>local\</b> folder. The structure should be:</div>
            <div style={{fontFamily:"'Courier New',monospace",fontSize:11,color:C.text3,background:"rgba(0,0,0,0.5)",border:`1px solid ${C.border}`,borderRadius:5,padding:12,marginTop:10,lineHeight:1.9}}>
              <div style={{color:C.goldDim}}>📁 mods\local\</div>
              <div style={{paddingLeft:20,color:C.goldDim}}>📁 {slugName}\</div>
              {["📄 mod.json","📄 modinfo.json","📄 README.txt"].map(f=><div key={f} style={{paddingLeft:40}}>{f}</div>)}
              <div style={{paddingLeft:40,color:C.goldDim}}>📁 attrib\</div>
              {["unit_stats.json","building_costs.json","civ_bonuses.json","resource_rates.json","global_settings.json"].map(f=><div key={f} style={{paddingLeft:60}}>📄 {f}</div>)}
            </div>
            <div style={{...mk.help,marginTop:10,marginBottom:0}}>⚠️ Do not double-nest. It must be <b>local\{slugName}\mod.json</b> not <b>local\{slugName}\{slugName}\mod.json</b></div>
          </P>
          <P id="ig-4" icon="4️⃣" title="Step 4 — Enable In-Game">
            <ol style={{paddingLeft:18,fontSize:13,lineHeight:2.1,color:C.text2}}>
              <li>Launch <b style={{color:C.gold}}>Age of Empires IV</b></li>
              <li>Go to <b style={{color:C.gold}}>Home → Mods → My Mods</b></li>
              <li>Find your mod and click the toggle to <b style={{color:C.gold}}>enable</b> it</li>
              <li><b style={{color:C.gold}}>Restart the game</b> when prompted</li>
              <li>Start a game — your changes are active!</li>
            </ol>
          </P>
          <P id="ig-mp" icon="👥" title="Multiplayer">
            <div style={{padding:"10px 12px",background:`rgba(${meta.mp?"200,168,75":"200,64,48"},0.07)`,border:`1px solid rgba(${meta.mp?"200,168,75":"200,64,48"},0.2)`,borderRadius:5,fontSize:13,color:C.text2,lineHeight:1.7,marginBottom:10}}>
              <b style={{color:meta.mp?C.gold:C.red}}>{meta.mp?"⚠️ Both players must have this mod installed.":"ℹ️ This mod is set as optional for multiplayer."}</b>
            </div>
            <ul style={{paddingLeft:18,fontSize:13,lineHeight:1.9,color:C.text2}}>
              <li>Both players must have the <b style={{color:C.gold}}>exact same version</b></li>
              <li>Mods are <b style={{color:C.gold}}>not allowed</b> in Ranked matches</li>
              <li>Custom lobbies and private matches work fine</li>
            </ul>
          </P>
          <P id="ig-trouble" icon="🔧" title="Troubleshooting">
            {[["Mod doesn't appear in My Mods","Ensure the folder isn't double-nested (local\\mod\\mod\\...)."],["Changes aren't taking effect","Fully restart AoE4 after enabling. Disable other mods to check conflicts."],["Game crashes on load","An extreme stat value may be the cause. Check the 📝 Changes tab."],["Multiplayer sync error","Both players need identical mod files — re-export and re-share the ZIP."]].map(([q,a],i,arr)=>(
              <div key={q} style={{padding:"9px 0",borderBottom:i<arr.length-1?`1px solid rgba(58,46,26,0.35)`:"none"}}>
                <div style={{fontSize:12,color:C.gold,marginBottom:3}}>❓ {q}</div>
                <div style={{fontSize:12,color:C.text3,fontStyle:"italic"}}>{a}</div>
              </div>
            ))}
          </P>
        </div>}

        {tab==="export"&&<div>
          <div style={mk.stitle}>📦 Export Mod</div>
          <div style={mk.ssub}>Download your complete AoE4 data mod ZIP — ready to install</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 290px",gap:16,alignItems:"start"}}>
            <div>
              <P id="ex-s" icon="📋" title="Mod Summary">
                {[["Name",meta.name||"Unnamed"],["Version",meta.version],["Author",meta.author||"Anonymous"],["Total Changes",totalChanges],["Units Modified",`${Object.keys(unitMods).length} / ${UNITS.length}`],["Buildings Modified",`${Object.keys(bldgMods).length} / ${BUILDINGS.length}`],["Civs Modified",`${Object.keys(civMods).length} / ${CIVS.length}`],["Techs Modified",`${Object.keys(techMods).length} / ${TECHS.length}`],["Landmarks Modified",`${Object.keys(lmMods).length} / ${LANDMARKS.length}`],["Flags Active",Object.values(flags).filter(Boolean).length],["Multiplayer Required",meta.mp?"Yes":"No"]].map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid rgba(58,46,26,0.3)`,fontSize:12}}>
                    <span style={{color:C.text3}}>{k}</span><span style={{color:C.gold2,fontWeight:"bold"}}>{v}</span>
                  </div>
                ))}
              </P>
              <P id="ex-f" icon="📁" title="Output File Structure">
                <div style={{fontFamily:"'Courier New',monospace",fontSize:11,color:C.text3,background:"rgba(0,0,0,0.5)",border:`1px solid ${C.border}`,borderRadius:4,padding:11,lineHeight:1.9}}>
                  <div style={{color:C.goldDim}}>📁 {slugName}/</div>
                  {["📄 mod.json","📄 modinfo.json","📄 README.txt"].map(f=><div key={f} style={{paddingLeft:20}}>{f}</div>)}
                  <div style={{paddingLeft:20,color:C.goldDim}}>📁 attrib/</div>
                  {["unit_stats.json","building_costs.json","civ_bonuses.json","resource_rates.json","global_settings.json",...(Object.keys(ageMods).length?["age_costs.json"]:[]),...(Object.keys(techMods).length?["technologies.json"]:[]),...(Object.keys(lmMods).length?["landmarks.json"]:[])].map(f=><div key={f} style={{paddingLeft:40,color:C.text2}}>📄 {f}</div>)}
                </div>
              </P>
              <P id="ex-j" icon="📄" title="JSON Preview" defaultOpen={false}>
                <textarea style={{...mk.ta,fontFamily:"'Courier New',monospace",fontSize:10,minHeight:200,background:"rgba(0,0,0,0.7)",color:C.text3}} readOnly value={JSON.stringify(buildJSON(),null,2)}/>
              </P>
            </div>
            <div style={{...mk.panel,padding:22,textAlign:"center"}}>
              <div style={{fontSize:46,marginBottom:11}}>📦</div>
              <div style={{fontFamily:"Georgia,serif",fontSize:16,color:C.gold2,marginBottom:4}}>{meta.name||"My Mod"}</div>
              <div style={{fontSize:11,color:C.text3,fontStyle:"italic",marginBottom:16}}>v{meta.version} · {totalChanges} changes</div>
              <div style={{height:5,background:C.border,borderRadius:3,overflow:"hidden",marginBottom:16}}>
                <div style={{height:"100%",width:`${Math.min(100,totalChanges)}%`,background:`linear-gradient(90deg,${C.goldDim},${C.gold2})`,borderRadius:3,transition:"width 0.4s"}}/>
              </div>
              <Btn variant="export" onClick={exportMod} style={{width:"100%",justifyContent:"center",fontSize:13,padding:13,opacity:exporting?0.6:1}}>
                {exporting?"⏳ Building ZIP...":"⬇ Download Mod ZIP"}
              </Btn>
              <div style={{fontSize:10,color:C.text3,marginTop:9,fontStyle:"italic"}}>Home → Mods → My Mods → Enable</div>
              <div style={{marginTop:14,padding:9,background:"rgba(64,160,96,0.07)",border:"1px solid rgba(64,160,96,0.2)",borderRadius:4,fontSize:11,color:"#6ab080",textAlign:"left",lineHeight:1.7}}>
                ✅ Legitimate data mod<br/>✅ No game files replaced<br/>✅ Skirmish + Multiplayer ready<br/>✅ AoE IV Season 7+ compatible
              </div>
              <hr style={{...mk.div,marginTop:14}}/>
              <Btn variant="secondary" onClick={()=>setTab("install")} style={{width:"100%",justifyContent:"center",fontSize:10}}>📖 View Full Install Guide</Btn>
            </div>
          </div>
        </div>}
      </div>

      {toast&&(
        <div style={{position:"fixed",bottom:18,right:18,background:C.bg4,border:`1px solid ${toast.type==="success"?C.green:toast.type==="error"?C.red:C.gold}`,borderRadius:5,padding:"9px 16px",fontFamily:"Georgia,serif",fontSize:12,color:toast.type==="success"?C.green:toast.type==="error"?C.red:C.gold2,boxShadow:"0 8px 32px rgba(0,0,0,0.8)",zIndex:9999,letterSpacing:1,maxWidth:300}}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
