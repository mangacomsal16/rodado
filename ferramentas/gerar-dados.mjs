// Gera dados.js (carreiras) e baixa os escudos a partir da Wikipedia em inglês.
// Uso:  node ferramentas/gerar-dados.mjs
// Para adicionar um jogador, inclua uma linha em TOP, LENDAS ou ETERNOS e rode de novo.
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = path.join(os.tmpdir(), 'trajetoria-cache');
const UA = { 'User-Agent': 'trajetoria-quiz/0.2 (projeto pessoal de fã)' };
const REFRESH = process.argv.includes('--atualizar'); // ignora o cache

// [título na Wikipedia, nome exibido, OVR, posição (sigla), clube atual segundo a lista de OVR]
const TOP = [
  ['Erling Haaland','Erling Haaland',91,'ATA','Manchester City'],
  ['Kylian Mbappé','Kylian Mbappé',91,'ATA','Real Madrid'],
  ['Lamine Yamal','Lamine Yamal',90,'PD','FC Barcelona'],
  ['Vitinha (footballer, born 2000)','Vitinha',90,'MC','Paris Saint-Germain'],
  ['Jude Bellingham','Jude Bellingham',90,'MEI','Real Madrid'],
  ['Pedri','Pedri',90,'MC','FC Barcelona'],
  ['Michael Olise','Michael Olise',90,'MD','Bayern München'],
  ['Rodri (footballer, born 1996)','Rodri',90,'VOL','FC Barcelona'],
  ['Ousmane Dembélé','Ousmane Dembélé',90,'ATA','Paris Saint-Germain'],
  ['Harry Kane','Harry Kane',90,'ATA','Bayern München'],
  ['Thibaut Courtois','Thibaut Courtois',90,'GL','Real Madrid'],
  ['Willian Pacho','Willian Pacho',89,'ZAG','Paris Saint-Germain'],
  ['Nuno Mendes (footballer, born 2002)','Nuno Mendes',89,'LE','Paris Saint-Germain'],
  ['Khvicha Kvaratskhelia','Khvicha Kvaratskhelia',89,'PE','Paris Saint-Germain'],
  ['Vinícius Júnior','Vinícius Júnior',89,'PE','Real Madrid'],
  ['Gabriel Magalhães','Gabriel Magalhães',89,'ZAG','Arsenal FC'],
  ['Gianluigi Donnarumma','Gianluigi Donnarumma',89,'GL','Manchester City'],
  ['Bruno Fernandes','Bruno Fernandes',89,'MEI','Manchester United'],
  ['Lionel Messi','Lionel Messi',89,'MEI','Inter Miami'],
  ['João Neves','João Neves',88,'MC','Paris Saint-Germain'],
  ['William Saliba','William Saliba',88,'ZAG','Arsenal FC'],
  ['Luis Díaz (footballer, born 1997)','Luis Díaz',88,'ME','Bayern München'],
  ['Achraf Hakimi','Achraf Hakimi',88,'LD','Paris Saint-Germain'],
  ['Declan Rice','Declan Rice',88,'VOL','Arsenal FC'],
  ['Raphinha','Raphinha',88,'PE','FC Barcelona'],
  ['David Raya','David Raya',88,'GL','Arsenal FC'],
  ['Joshua Kimmich','Joshua Kimmich',88,'VOL','Bayern München'],
  ['Virgil van Dijk','Virgil van Dijk',88,'ZAG','Liverpool FC'],
  ['Jan Oblak','Jan Oblak',88,'GL','Atlético Madrid'],
  ['Jamal Musiala','Jamal Musiala',87,'MEI','Bayern München'],
  ['Nico Schlotterbeck','Nico Schlotterbeck',87,'ZAG','Borussia Dortmund'],
  ['Bukayo Saka','Bukayo Saka',87,'PD','Arsenal FC'],
  ['Rúben Dias','Rúben Dias',87,'ZAG','Manchester City'],
  ['Federico Valverde','Federico Valverde',87,'MC','Real Madrid'],
  ['Gregor Kobel','Gregor Kobel',87,'GL','Borussia Dortmund'],
  ['Lautaro Martínez','Lautaro Martínez',87,'ATA','Inter Milan'],
  ['Dayot Upamecano','Dayot Upamecano',87,'ZAG','Bayern München'],
  ['Nicolò Barella','Nicolò Barella',87,'MC','Inter Milan'],
  ['Mike Maignan','Mike Maignan',87,'GL','AC Milan'],
  ['Jonathan Tah','Jonathan Tah',87,'ZAG','Bayern München'],
  ['Alisson Becker','Alisson',87,'GL','Liverpool FC'],
  ['Mohamed Salah','Mohamed Salah',87,'MD','Trabzonspor'],
  ['Marquinhos','Marquinhos',87,'ZAG','Paris Saint-Germain'],
  ['Pau Cubarsí','Pau Cubarsí',86,'ZAG','FC Barcelona'],
  ['Désiré Doué','Désiré Doué',86,'PD','Paris Saint-Germain'],
  ['Joan Garcia','Joan García',86,'GL','FC Barcelona'],
  ['Florian Wirtz','Florian Wirtz',86,'MEI','Liverpool FC'],
  ['Moisés Caicedo','Moisés Caicedo',86,'VOL','Chelsea FC'],
  ['Marco Carnesecchi','Marco Carnesecchi',86,'GL','Atalanta BC'],
  ['Rayan Cherki','Rayan Cherki',86,'PD','Manchester City'],
  ['Bruno Guimarães','Bruno Guimarães',86,'MC','Arsenal FC'],
  ['Enzo Fernández','Enzo Fernández',86,'MC','Manchester City'],
  ['Julián Alvarez','Julián Álvarez',86,'ATA','Atlético Madrid'],
  ['Viktor Gyökeres','Viktor Gyökeres',86,'ATA','Arsenal FC'],
  ['Gleison Bremer','Bremer',86,'ZAG','Juventus FC'],
  ['Marc Cucurella','Marc Cucurella',86,'LE','Real Madrid'],
  ['Alessandro Bastoni','Alessandro Bastoni',86,'ZAG','Inter Milan'],
  ['Scott McTominay','Scott McTominay',86,'MC','SSC Napoli'],
  ['Dominik Szoboszlai','Dominik Szoboszlai',86,'MEI','Liverpool FC'],
  ['Diogo Costa','Diogo Costa',86,'GL','FC Porto'],
  ['Alexander Isak','Alexander Isak',86,'ATA','Liverpool FC'],
  ['Frenkie de Jong','Frenkie de Jong',86,'MC','FC Barcelona'],
  ['Fabián Ruiz','Fabián Ruiz',86,'MC','Paris Saint-Germain'],
  ['Federico Dimarco','Federico Dimarco',86,'LE','Inter Milan'],
  ['Martin Ødegaard','Martin Ødegaard',86,'MC','Arsenal FC'],
  ['Fermín López','Fermín López',85,'MEI','FC Barcelona'],
  ['Bradley Barcola','Bradley Barcola',85,'PE','Liverpool FC'],
  ['Cole Palmer','Cole Palmer',85,'MEI','Chelsea FC'],
  ['Hugo Ekitike','Hugo Ekitiké',85,'ATA','Liverpool FC'],
  ['Joško Gvardiol','Joško Gvardiol',85,'ZAG','Manchester City'],
  ['Felix Nmecha','Felix Nmecha',85,'MC','Borussia Dortmund'],
  ['Ryan Gravenberch','Ryan Gravenberch',85,'VOL','Liverpool FC'],
  ['Eric García (footballer, born 2001)','Eric García',85,'ZAG','FC Barcelona'],
  ['Deniz Undav','Deniz Undav',85,'ATA','VfB Stuttgart'],
  ['Jules Koundé','Jules Koundé',85,'LD','FC Barcelona'],
  ['Antoine Semenyo','Antoine Semenyo',85,'PD','Manchester City'],
  ['Marc Guéhi','Marc Guéhi',85,'ZAG','Manchester City'],
  ['Sandro Tonali','Sandro Tonali',85,'VOL','Tottenham Hotspur'],
  ['Victor Osimhen','Victor Osimhen',85,'ATA','Galatasaray SK'],
  ['Mile Svilar','Mile Svilar',85,'GL','AS Roma'],
  ['Unai Simón','Unai Simón',85,'GL','Athletic Club'],
  ['Marcus Thuram','Marcus Thuram',85,'ATA','Inter Milan'],
  ['Marcos Llorente','Marcos Llorente',85,'LD','Atlético Madrid'],
  ['Konrad Laimer','Konrad Laimer',85,'LD','Bayern München'],
  ['Rúben Neves','Rúben Neves',85,'VOL','Al Hilal'],
  ['Youri Tielemans','Youri Tielemans',85,'MC','Manchester United'],
  ['Serhou Guirassy','Serhou Guirassy',85,'ATA','Borussia Dortmund'],
  ['Paulo Dybala','Paulo Dybala',85,'MEI','AS Roma'],
  ['Alejandro Grimaldo','Grimaldo',85,'ME','Atlético Madrid'],
  ['Adrien Rabiot','Adrien Rabiot',85,'MC','AC Milan'],
  ['Hakan Çalhanoğlu','Hakan Çalhanoğlu',85,'VOL','Inter Milan'],
  ['Jordan Pickford','Jordan Pickford',85,'GL','Everton FC'],
  ['Emiliano Martínez','Emiliano Martínez',85,'GL','Chelsea FC'],
  ['Granit Xhaka','Granit Xhaka',85,'VOL','Sunderland AFC'],
  ['Kevin De Bruyne','Kevin De Bruyne',85,'MEI','SSC Napoli'],
  ['Luka Modrić','Luka Modrić',85,'MC','AC Milan'],
  ['Kenan Yıldız','Kenan Yıldız',84,'MEI','Juventus FC'],
  ['Nico Paz','Nico Paz',84,'MEI','Como'],
  ['Morgan Rogers','Morgan Rogers',84,'MEI','Chelsea FC'],
  ['Nico Williams','Nico Williams',84,'PE','Athletic Club'],
  ['Piero Hincapié','Piero Hincapié',84,'LE','Arsenal FC'],
  ['Elliot Anderson','Elliot Anderson',84,'VOL','Manchester City'],
  ['Jurriën Timber','Jurriën Timber',84,'LD','Arsenal FC'],
  ['Martín Zubimendi','Martín Zubimendi',84,'VOL','Arsenal FC'],
  ['Jérémy Doku','Jérémy Doku',84,'PE','Manchester City'],
  ['Dani Olmo','Dani Olmo',84,'MEI','FC Barcelona'],
  ['Rodrygo','Rodrygo',84,'PE','Real Madrid'],
  ['Bryan Mbeumo','Bryan Mbeumo',84,'MD','Manchester United'],
  ['Aurélien Tchouaméni','Aurélien Tchouaméni',84,'VOL','Real Madrid'],
  ['Ferran Torres','Ferran Torres',84,'ATA','Paris Saint-Germain'],
  ['Tijjani Reijnders','Tijjani Reijnders',84,'MC','Al Qadsiah FC'],
  ['Matheus Cunha','Matheus Cunha',84,'ME','Manchester United'],
  ['Éder Militão','Éder Militão',84,'ZAG','Real Madrid'],
  ['Alexis Mac Allister','Alexis Mac Allister',84,'MC','Liverpool FC'],
  ['Reece James (footballer, born 1999)','Reece James',84,'LD','Chelsea FC'],
  ['Phil Foden','Phil Foden',84,'MEI','Manchester City'],
  ['Ibrahima Konaté','Ibrahima Konaté',84,'ZAG','Real Madrid'],
  ['Boubacar Kamara','Boubacar Kamara',84,'VOL','Aston Villa'],
  ['Eberechi Eze','Eberechi Eze',84,'MEI','Arsenal FC'],
  ['Julián Quiñones','Julián Quiñones',84,'ATA','Al Qadsiah FC'],
];

// Lendas ainda em atividade (muitas em ligas alternativas): [título, nome, posição]
const LENDAS = [
  ['Cristiano Ronaldo','Cristiano Ronaldo','ATA'],
  ['Neymar','Neymar','ATA'],
  ['Luis Suárez (Uruguayan footballer)','Luis Suárez','ATA'],
  ['Antoine Griezmann','Antoine Griezmann','ATA'],
  ['Robert Lewandowski','Robert Lewandowski','ATA'],
  ['Thomas Müller','Thomas Müller','MEI'],
  ['Ángel Di María','Ángel Di María','PD'],
  ['James Rodríguez','James Rodríguez','MEI'],
  ['Son Heung-min','Son Heung-min','ATA'],
  ['Marco Reus','Marco Reus','MEI'],
  ['Memphis Depay','Memphis Depay','ATA'],
  ['Thiago Silva','Thiago Silva','ZAG'],
  ['Sadio Mané','Sadio Mané','PE'],
  ["N'Golo Kanté","N'Golo Kanté",'VOL'],
  ['Philippe Coutinho','Philippe Coutinho','MEI'],
  ['Hulk (footballer)','Hulk','ATA'],
  ['Casemiro','Casemiro','VOL'],
];

// Ídolos aposentados ou sem clube no momento: [título, nome, posição]
const ETERNOS = [
  ['Karim Benzema','Karim Benzema','ATA'],
  ['Sergio Ramos','Sergio Ramos','ZAG'],
  ['Edinson Cavani','Edinson Cavani','ATA'],
  ['Riyad Mahrez','Riyad Mahrez','PD'],
  ['Paul Pogba','Paul Pogba','MC'],
  ['Ronaldo (Brazilian footballer)','Ronaldo Nazário','ATA'],
  ['Ronaldinho','Ronaldinho Gaúcho','MEI'],
  ['Kaká','Kaká','MEI'],
  ['Zlatan Ibrahimović','Zlatan Ibrahimović','ATA'],
  ['David Beckham','David Beckham','MC'],
];

const APELIDOS = {
  'Cristiano Ronaldo':['cr7','cristiano'], 'Neymar':['neymar jr','ney'], 'Lionel Messi':['messi','leo messi'],
  'Vinícius Júnior':['vini jr','vinicius jr','vini'], 'Ronaldo Nazário':['ronaldo','fenomeno','ronaldo fenomeno','r9'],
  'Ronaldinho Gaúcho':['ronaldinho','r10','dinho'], 'Zlatan Ibrahimović':['ibra','ibrahimovic'],
  'Kylian Mbappé':['mbappe'], 'Erling Haaland':['haaland'], 'Gabriel Magalhães':['gabriel'],
  'Alisson':['alisson becker'], 'Bremer':['gleison bremer'], 'Grimaldo':['alejandro grimaldo'],
  'Fermín López':['fermin'], 'Rodri':['rodrigo hernandez'], 'Hulk':['givanildo'], 'Son Heung-min':['son','sonny'],
};

const POS = { ATA:'Atacante', PE:'Ponta-esquerda', PD:'Ponta-direita', MEI:'Meia', MC:'Meio-campo', VOL:'Volante',
  ZAG:'Zagueiro', LE:'Lateral-esquerdo', LD:'Lateral-direito', GL:'Goleiro', ME:'Meia-esquerda', MD:'Meia-direita' };

const PAISES = { Norway:'Noruega', France:'França', Spain:'Espanha', Portugal:'Portugal', England:'Inglaterra',
  Belgium:'Bélgica', Ecuador:'Equador', Georgia:'Geórgia', Brazil:'Brasil', Italy:'Itália', Argentina:'Argentina',
  Colombia:'Colômbia', Morocco:'Marrocos', Netherlands:'Holanda', Slovenia:'Eslovênia', Germany:'Alemanha',
  Switzerland:'Suíça', Uruguay:'Uruguai', Egypt:'Egito', Hungary:'Hungria', Scotland:'Escócia', Sweden:'Suécia',
  Croatia:'Croácia', Nigeria:'Nigéria', Serbia:'Sérvia', Turkey:'Turquia', 'Türkiye':'Turquia', Mexico:'México',
  Ghana:'Gana', Austria:'Áustria', Guinea:'Guiné', Algeria:'Argélia', Senegal:'Senegal', 'South Korea':'Coreia do Sul',
  Wales:'País de Gales', Poland:'Polônia', Cameroon:'Camarões', Denmark:'Dinamarca', 'United States':'Estados Unidos' };

// Nome curto (em português) para clubes conhecidos; chave = título da página na Wikipedia
const NOMES_CLUBES = {
  'FC Bayern Munich':'Bayern', 'Paris Saint-Germain FC':'PSG', 'Manchester United F.C.':'Man. United',
  'Manchester City F.C.':'Man. City', 'Inter Milan':'Inter de Milão', 'Atlético Madrid':'Atlético de Madrid',
  'Borussia Dortmund':'Dortmund', 'Tottenham Hotspur F.C.':'Tottenham', 'FC Red Bull Salzburg':'RB Salzburg',
  'Sporting CP':'Sporting', 'SL Benfica':'Benfica', 'Bayer 04 Leverkusen':'Leverkusen', 'Olympique Lyonnais':'Lyon',
  'Olympique de Marseille':'Olympique de Marseille','AS Monaco FC':'Monaco', 'Real Madrid CF':'Real Madrid',
  'FC Barcelona':'Barcelona', 'Juventus FC':'Juventus', 'AC Milan':'Milan', 'SSC Napoli':'Napoli', 'AS Roma':'Roma',
  'Athletic Bilbao':'Athletic Bilbao', 'Sevilla FC':'Sevilla', 'Valencia CF':'Valencia', 'Villarreal CF':'Villarreal',
  'Real Sociedad':'Real Sociedad', 'RB Leipzig':'RB Leipzig', 'VfL Wolfsburg':'Wolfsburg', 'Al-Nassr FC':'Al-Nassr',
  'Al Hilal SFC':'Al-Hilal', 'Al-Ittihad Club':'Al-Ittihad', 'Al-Ahli Saudi FC':'Al-Ahli', 'Santos FC':'Santos',
  'Grêmio FBPA':'Grêmio', 'SC Corinthians Paulista':'Corinthians', 'Cruzeiro EC':'Cruzeiro', 'São Paulo FC':'São Paulo',
  'Clube Atlético Mineiro':'Atlético-MG', 'CR Flamengo':'Flamengo', 'Fluminense FC':'Fluminense',
  'Sociedade Esportiva Palmeiras':'Palmeiras', 'CR Vasco da Gama':'Vasco', 'Club Athletico Paranaense':'Athletico-PR',
  'Sport Club Internacional':'Internacional', 'Brighton & Hove Albion F.C.':'Brighton', 'Wolverhampton Wanderers F.C.':'Wolves',
  'Newcastle United F.C.':'Newcastle', 'West Ham United F.C.':'West Ham', 'Crystal Palace F.C.':'Crystal Palace',
  'Nottingham Forest F.C.':'Nottingham Forest', 'Aston Villa F.C.':'Aston Villa', 'Inter Miami CF':'Inter Miami',
  'LA Galaxy':'LA Galaxy', 'Club Nacional de Football':'Nacional', 'Club Atlético River Plate':'River Plate',
  'Boca Juniors':'Boca Juniors', 'Racing Club de Avellaneda':'Racing', 'Club Atlético Independiente':'Independiente',
  "Newell's Old Boys":"Newell's", 'Rosario Central':'Rosario Central', 'Club Atlético Talleres':'Talleres',
  'VfB Stuttgart':'Stuttgart', 'Eintracht Frankfurt':'Eintracht Frankfurt', 'Borussia Mönchengladbach':'Gladbach',
  'TSG 1899 Hoffenheim':'Hoffenheim', 'SC Freiburg':'Freiburg', '1. FSV Mainz 05':'Mainz', 'Hamburger SV':'Hamburgo',
  'FC Schalke 04':'Schalke 04', 'Hertha BSC':'Hertha', 'Galatasaray S.K.':'Galatasaray', 'Fenerbahçe S.K.':'Fenerbahçe',
  'Beşiktaş J.K.':'Beşiktaş', 'Trabzonspor':'Trabzonspor', 'FC Porto':'Porto', 'SC Braga':'Braga',
  'Vitória S.C.':'Vitória de Guimarães', 'Rio Ave F.C.':'Rio Ave', 'PSV Eindhoven':'PSV', 'AFC Ajax':'Ajax',
  'Feyenoord':'Feyenoord', 'AZ Alkmaar':'AZ', 'FC Groningen':'Groningen', 'Club Brugge KV':'Club Brugge',
  'R.S.C. Anderlecht':'Anderlecht', 'K.R.C. Genk':'Genk', 'Lille OSC':'Lille', 'Stade Rennais FC':'Rennes',
  'OGC Nice':'Nice', 'RC Lens':'Lens', 'FC Nantes':'Nantes', 'AJ Auxerre':'Auxerre', 'Le Havre AC':'Le Havre',
  'Stade de Reims':'Reims', 'Montpellier HSC':'Montpellier', 'FC Girondins de Bordeaux':'Bordeaux',
  'Toulouse FC':'Toulouse', 'RC Strasbourg Alsace':'Strasbourg', 'Atalanta BC':'Atalanta', 'ACF Fiorentina':'Fiorentina',
  'SS Lazio':'Lazio', 'Torino FC':'Torino', 'Bologna FC 1909':'Bologna', 'Udinese Calcio':'Udinese', 'US Sassuolo Calcio':'Sassuolo',
  'Cagliari Calcio':'Cagliari', 'Genoa CFC':'Genoa', 'Empoli FC':'Empoli', 'Como 1907':'Como', 'US Cremonese':'Cremonese',
  'Hellas Verona FC':'Verona', 'Brescia Calcio':'Brescia', 'UC Sampdoria':'Sampdoria', 'Parma Calcio 1913':'Parma',
  'Chelsea F.C.':'Chelsea', 'Arsenal F.C.':'Arsenal', 'Liverpool F.C.':'Liverpool', 'Everton F.C.':'Everton',
  'Leicester City F.C.':'Leicester', 'Southampton F.C.':'Southampton', 'Brentford F.C.':'Brentford', 'Fulham F.C.':'Fulham',
  'Sunderland A.F.C.':'Sunderland', 'Bournemouth':'Bournemouth', 'AFC Bournemouth':'Bournemouth',
  'Leeds United F.C.':'Leeds', 'Sheffield United F.C.':'Sheffield United', 'Burnley F.C.':'Burnley', 'Watford F.C.':'Watford',
  'Celtic F.C.':'Celtic', 'Rangers F.C.':'Rangers', 'Real Betis':'Betis', 'Getafe CF':'Getafe', 'RCD Espanyol':'Espanyol',
  'RC Celta de Vigo':'Celta de Vigo', 'UD Las Palmas':'Las Palmas', 'Girona FC':'Girona', 'CA Osasuna':'Osasuna',
  'Deportivo Alavés':'Alavés', 'RCD Mallorca':'Mallorca', 'Real Valladolid':'Valladolid', 'Granada CF':'Granada',
  'Al Qadsiah FC':'Al-Qadsiah', 'Al-Qadsiah FC':'Al-Qadsiah', 'Los Angeles FC':'LAFC', 'Orlando City SC':'Orlando City',
  'Vancouver Whitecaps FC':'Vancouver Whitecaps', 'Chicago Fire FC':'Chicago Fire', 'CF Monterrey':'Monterrey',
  'Club León':'León', 'Club América':'América', 'C.D. Guadalajara':'Chivas', 'Tigres UANL':'Tigres', 'Cruz Azul':'Cruz Azul',
  'Club Universidad Nacional':'Pumas', 'Atlas F.C.':'Atlas', 'Shanghai Port F.C.':'Shanghai Port',
  'Guangzhou F.C.':'Guangzhou', 'Zenit Saint Petersburg':'Zenit', 'FC Shakhtar Donetsk':'Shakhtar', 'Dinamo Zagreb':'Dinamo Zagreb',
  'GNK Dinamo Zagreb':'Dinamo Zagreb', 'FC Dinamo Tbilisi':'Dinamo Tbilisi', 'FC Rubin Kazan':'Rubin Kazan',
  'FK Partizan':'Partizan', 'Red Star Belgrade':'Estrela Vermelha', 'Malmö FF':'Malmö', 'IFK Norrköping':'Norrköping',
  'Molde FK':'Molde', 'Bryne FK':'Bryne', 'Strømsgodset IF':'Strømsgodset', 'Brøndby IF':'Brøndby', 'FC Midtjylland':'Midtjylland',
  'FC Basel':'Basel', 'BSC Young Boys':'Young Boys', 'FC Zürich':'Zürich', 'Grasshopper Club Zürich':'Grasshopper',
  'Querétaro F.C.':'Querétaro', 'PSV':'PSV', 'Real Sociedad B':'Real Sociedad B', 'Stade Rennais F.C.':'Rennes',
  'FC Zenit Saint Petersburg':'Zenit', 'Esporte Clube Vitória':'Vitória', 'IF Brommapojkarna':'Brommapojkarna',
  'Stourbridge F.C.':'Stourbridge', 'FC Augsburg':'Augsburg', 'FC Liefering':'Liefering', 'Royal Antwerp FC':'Antwerp',
  'Royale Union Saint-Gilloise':'Union Saint-Gilloise', 'Vejle Boldklub':'Vejle', 'Galatasaray S.K. (football)':'Galatasaray',
  'Fenerbahçe S.K. (football)':'Fenerbahçe', 'Al-Ittihad Club (Jeddah)':'Al-Ittihad', 'Preston North End F.C.':'Preston',
};

// Times B / reservas / sub-23 ficam de fora da carreira
const RESERVA = /((?<!Willem)\s(B|C|II|III|2|3)$|\bU-?\d{2}\b|Under-\d{2}|Reserves|Next Gen|Castilla|\sAtl[eéè]tic(o)?$|Mestalla|Bilbao Athletic|Betis Deportivo|Celta Fortuna|^Jong\s|Academy|Primavera|Juvenil|\(youth\))/i;

// Ajustes manuais pontuais (preenchidos após conferir a saída)
const CORRECOES = {
  'marco-carnesecchi': { pais:'Itália' }, // ainda sem jogo pela seleção principal
};

/* ------------------------------------------------------------------ */
const sleep = ms => new Promise(r => setTimeout(r, ms));
const slug = s => s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

async function api(params, wiki = 'en.wikipedia.org'){
  const url = `https://${wiki}/w/api.php?` + new URLSearchParams({ format:'json', formatversion:'2', maxlag:'5', ...params });
  for (let t = 0; t < 8; t++) {
    const r = await fetch(url, { headers:UA, signal:AbortSignal.timeout(30000) }).catch(() => null);
    if (r?.ok) return r.json();
    if (!r) { await sleep(5000); continue; }
    const wait = (+r.headers.get('retry-after') || 5 * (t + 1)) * 1000;
    console.log(`  (Wikipedia pediu pra esperar ${wait / 1000}s)`);
    await sleep(wait);
  }
  throw new Error('falha na API: ' + url);
}

const cacheFile = title => path.join(CACHE, slug(title) + '.json');

// Baixa o wikitext de várias páginas por requisição (com continuação) e guarda em cache
async function prefetch(titles){
  fs.mkdirSync(CACHE, { recursive:true });
  const falta = titles.filter(t => REFRESH || !fs.existsSync(cacheFile(t)));
  for (let i = 0; i < falta.length; i += 20) {
    const lote = falta.slice(i, i + 20);
    let cont = {};
    const paginas = {}, mapa = {};
    do {
      const d = await api({ action:'query', prop:'revisions', rvprop:'content', rvslots:'main', redirects:'1', titles:lote.join('|'), ...cont });
      for (const x of d.query.normalized || []) mapa[x.from] = x.to;
      for (const x of d.query.redirects || []) mapa[x.from] = x.to;
      for (const p of d.query.pages) if (p.revisions) paginas[p.title] = p.revisions[0].slots.main.content;
      cont = d.continue || null;
      await sleep(800);
    } while (cont);
    for (const t of lote) {
      let r = mapa[t] || t; r = mapa[r] || r;
      if (paginas[r]) fs.writeFileSync(cacheFile(t), JSON.stringify({ title:r, text:paginas[r] }));
    }
    console.log(`  páginas: ${Math.min(i + 20, falta.length)}/${falta.length}`);
  }
}

function wikitext(title){
  if (!fs.existsSync(cacheFile(title))) throw new Error('página não encontrada na Wikipedia: ' + title);
  return JSON.parse(fs.readFileSync(cacheFile(title), 'utf8'));
}

function infobox(text){
  text = text.replace(/<!--[\s\S]*?-->/g,'').replace(/<ref[^>]*\/>/gi,'').replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi,'');
  const i = text.search(/\{\{\s*Infobox (football|soccer) biography/i);
  if (i < 0) return null;
  let depth = 0, j = i;
  for (; j < text.length; j++) {
    if (text.startsWith('{{', j)) { depth++; j++; }
    else if (text.startsWith('}}', j)) { depth--; j++; if (depth === 0) break; }
  }
  const body = text.slice(i + 2, j - 1);
  const parts = []; let cur = ''; depth = 0;
  for (let k = 0; k < body.length; k++) {
    const two = body.slice(k, k + 2);
    if (two === '{{' || two === '[[') { depth++; cur += two; k++; continue; }
    if (two === '}}' || two === ']]') { depth--; cur += two; k++; continue; }
    if (body[k] === '|' && depth === 0) { parts.push(cur); cur = ''; continue; }
    cur += body[k];
  }
  parts.push(cur);
  const out = {};
  for (const p of parts.slice(1)) { const eq = p.indexOf('='); if (eq > 0) out[p.slice(0, eq).trim()] = p.slice(eq + 1).trim(); }
  return out;
}

function link(v){
  if (!v) return null;
  const m = v.match(/\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]+))?\]\]/);
  if (m) return { target:m[1].trim(), text:(m[2] || m[1]).trim() };
  const plain = v.replace(/\{\{[^}]*\}\}/g,'').replace(/[→()]|\bloan\b/gi,'').trim();
  return plain ? { target:null, text:plain } : null;
}

function years(v){
  v = (v || '').replace(/\{\{0+\}\}/g,'').replace(/&ndash;|\{\{ndash\}\}/g,'–');
  const m = v.match(/(\d{4})\s*([–\-])?\s*(\d{4})?/);
  if (!m) return null;
  const a = +m[1];
  return [a, m[3] ? +m[3] : m[2] ? null : a];
}

function rows(box, yKey, cKey){
  const out = [];
  for (let n = 1; n <= 45; n++) {
    const c = box[cKey + n], y = box[yKey + n];
    if (!c) continue;
    const l = link(c), yr = years(y);
    if (!l || !yr) continue;
    out.push({ ...l, a:yr[0], b:yr[1], emp:/loan|→/i.test(c) });
  }
  return out;
}

function nationality(box){
  let pais = null;
  for (let n = 1; n <= 12; n++) {
    const l = link(box['nationalteam' + n]);
    if (!l?.target) continue;
    if (/under|U-?\d|olympic|\bB\b|futsal|beach|Catalonia|Basque|Galicia|Andalusia/i.test(l.target + ' ' + l.text)) continue;
    const m = l.target.match(/^(.+?) (?:men's )?national (?:association )?football team$/i);
    if (m) pais = m[1];
  }
  return pais;
}

/* ------------------------------------------------------------------ */
const lista = [
  ...TOP.map(([t, nome, ovr, pos, clubeLista]) => ({ t, nome, ovr, pos, clubeLista, sec:'top' })),
  ...LENDAS.map(([t, nome, pos]) => ({ t, nome, pos, sec:'lenda' })),
  ...ETERNOS.map(([t, nome, pos]) => ({ t, nome, pos, sec:'eterno' })),
];

await prefetch(lista.map(j => j.t));

const brutos = [], avisos = [], descartados = new Set();
for (const j of lista) {
  let title, text;
  try { ({ title, text } = wikitext(j.t)); } catch (e) { avisos.push(e.message); continue; }
  const box = infobox(text);
  if (!box) { avisos.push(`SEM INFOBOX: ${j.t}`); continue; }

  const senior = rows(box, 'years', 'clubs').filter(r => {
    const res = RESERVA.test(r.target || '') || RESERVA.test(r.text);
    if (res) descartados.add(`${r.text} → ${r.target}`);
    return !res && r.a >= 1950;
  });

  const pais = nationality(box);
  if (!pais && !CORRECOES[slug(j.nome)]?.pais) avisos.push(`SEM SELEÇÃO: ${j.nome}`);
  else if (pais && !PAISES[pais]) avisos.push(`PAÍS SEM TRADUÇÃO: ${pais} (${j.nome})`);
  if (!senior.length) avisos.push(`SEM CLUBES: ${j.nome}`);
  if (j.sec === 'lenda' && senior.at(-1)?.b !== null) avisos.push(`LENDA PARECE APOSENTADA: ${j.nome} (último: ${senior.at(-1)?.text} ${senior.at(-1)?.b})`);
  brutos.push({ ...j, wiki:title, pais:PAISES[pais] || pais, senior, atualWiki:link(box.currentclub)?.text || '—' });
}

// ---- escudos ----
const alvos = [...new Set(brutos.flatMap(j => j.senior.map(c => c.target).filter(Boolean)))];
const resolvido = {}, imagens = {};
for (let i = 0; i < alvos.length; i += 50) {
  const d = await api({ action:'query', prop:'pageimages', piprop:'thumbnail|name', pithumbsize:'160', pilicense:'any', redirects:'1', titles:alvos.slice(i, i + 50).join('|') });
  const norm = Object.fromEntries((d.query.normalized || []).map(x => [x.from, x.to]));
  const redir = Object.fromEntries((d.query.redirects || []).map(x => [x.from, x.to]));
  for (const a of alvos.slice(i, i + 50)) { let t = norm[a] || a; t = redir[t] || t; resolvido[a] = t; }
  for (const p of d.query.pages) imagens[p.title] = p.thumbnail?.source || null;
  await sleep(150);
}

// ---- carreiras ----
const idDe = c => c.target ? slug(resolvido[c.target]) : 'x-' + slug(c.text);
const jogadores = brutos.map(j => {
  // junta passagens seguidas no mesmo clube (ex.: empréstimo que virou compra)
  const senior = j.senior.map(c => ({ ...c, id:idDe(c) })).reduce((acc, r) => {
    const p = acc.at(-1);
    if (p && p.id === r.id) { p.b = r.b; p.emp = p.emp && r.emp; return acc; }
    acc.push(r); return acc;
  }, []);
  return { ...j, carreira:senior.sort((x, y) => x.a - y.a) };
});

// ---- escudos (só dos clubes que entraram em alguma carreira) ----
const dirEsc = path.join(ROOT, 'escudos');
fs.mkdirSync(dirEsc, { recursive:true });
const titulo = {}, textos = {};
for (const j of jogadores) for (const c of j.carreira) {
  if (c.target) titulo[c.id] = resolvido[c.target];
  (textos[c.id] ||= {})[c.text] = (textos[c.id][c.text] || 0) + 1;
}
const clubes = {}, semEscudo = [];
for (const id of Object.keys(textos).sort()) {
  const t = titulo[id];
  // escudo na Wikipedia é SVG/PNG; JPG quase sempre é foto do elenco ou do estádio
  const src = t && imagens[t] && !/\.jpe?g$/i.test(imagens[t].split('?')[0]) ? imagens[t].split('?')[0] : null;
  let img = null;
  if (src) {
    const file = `${id}.${(src.match(/\.(png|gif|webp)$/i)?.[1] || 'png').toLowerCase()}`;
    if (!fs.existsSync(path.join(dirEsc, file))) {
      for (let k = 0; k < 6; k++) {
        const r = await fetch(src, { headers:UA });
        if (r.ok) { fs.writeFileSync(path.join(dirEsc, file), Buffer.from(await r.arrayBuffer())); break; }
        await sleep((+r.headers.get('retry-after') || 5 * (k + 1)) * 1000);
      }
      await sleep(250);
    }
    if (fs.existsSync(path.join(dirEsc, file))) img = `escudos/${file}`;
  }
  if (!img) semEscudo.push(t || textos[id] && Object.keys(textos[id])[0]);
  // nome exibido: tradução > texto do link mais comum
  clubes[id] = { n:NOMES_CLUBES[t] || Object.entries(textos[id]).sort((a, b) => b[1] - a[1])[0][0], img };
}
const usados = new Set(Object.values(clubes).map(c => c.img?.slice('escudos/'.length)));
for (const f of fs.readdirSync(dirEsc)) if (!usados.has(f)) fs.unlinkSync(path.join(dirEsc, f));

// ---- fama → níveis ----
// Fama = visitas à página do jogador na Wikipedia (inglês e português) nos últimos 60 dias.
// O ranking final é a média das duas posições, pra pesar quem é conhecido no mundo e no Brasil.
const NIVEIS = ['facil', 'medio', 'dificil', 'insano'];
const cacheVisitas = path.join(CACHE, 'visitas.json');
const visitasSalvas = !REFRESH && fs.existsSync(cacheVisitas) ? JSON.parse(fs.readFileSync(cacheVisitas, 'utf8')) : {};

// soma das visitas diárias, 50 páginas por pedido
async function visitas(wiki, titulos){
  const out = {};
  const falta = titulos.filter(t => t && visitasSalvas[`${wiki}:${t}`] === undefined);
  for (let i = 0; i < falta.length; i += 50) {
    let cont = {};
    do {
      const d = await api({ action:'query', prop:'pageviews', pvipdays:'60', titles:falta.slice(i, i + 50).join('|'), ...cont }, wiki);
      for (const p of d.query.pages) if (p.pageviews) visitasSalvas[`${wiki}:${p.title}`] = Object.values(p.pageviews).reduce((s, v) => s + (v || 0), 0);
      cont = d.continue || null;
      await sleep(1000);
    } while (cont);
  }
  fs.writeFileSync(cacheVisitas, JSON.stringify(visitasSalvas));
  for (const t of titulos) if (t) out[t] = visitasSalvas[`${wiki}:${t}`] || 0;
  return out;
}

const tituloPt = {};
for (let i = 0; i < jogadores.length; i += 50) {
  const d = await api({ action:'query', prop:'langlinks', lllang:'pt', lllimit:'max', titles:jogadores.slice(i, i + 50).map(j => j.wiki).join('|') });
  for (const p of d.query.pages) tituloPt[p.title] = p.langlinks?.[0]?.title || null;
  await sleep(1000);
}
const vEn = await visitas('en.wikipedia.org', jogadores.map(j => j.wiki));
const vPt = await visitas('pt.wikipedia.org', jogadores.map(j => tituloPt[j.wiki]));
for (const j of jogadores) { j.vEn = vEn[j.wiki] || 0; j.vPt = vPt[tituloPt[j.wiki]] || 0; }
// fama de longo prazo: em quantas Wikipedias (idiomas) o jogador tem artigo — não oscila com notícia de transferência
const qid = {};
for (let i = 0; i < jogadores.length; i += 50) {
  const d = await api({ action:'query', prop:'pageprops', ppprop:'wikibase_item', titles:jogadores.slice(i, i + 50).map(j => j.wiki).join('|') });
  for (const p of d.query.pages) qid[p.title] = p.pageprops?.wikibase_item;
  await sleep(1000);
}
const idiomas = {};
const qids = jogadores.map(j => qid[j.wiki]).filter(Boolean);
for (let i = 0; i < qids.length; i += 50) {
  const d = await api({ action:'wbgetentities', ids:qids.slice(i, i + 50).join('|'), props:'sitelinks' }, 'www.wikidata.org');
  for (const [q, e] of Object.entries(d.entities)) idiomas[q] = Object.keys(e.sitelinks || {}).filter(s => /wiki$/.test(s) && !/commons|species|wikidata/.test(s)).length;
  await sleep(1000);
}
for (const j of jogadores) j.idiomas = idiomas[qid[j.wiki]] || 0;

// ranking final = média das posições em: idiomas, visitas en e visitas pt
const tops = jogadores.filter(j => j.sec === 'top');
for (const k of ['idiomas', 'vEn', 'vPt']) [...tops].sort((a, b) => b[k] - a[k]).forEach((j, i) => { j['r' + k] = i; });
const porFama = [...tops].sort((a, b) => (a.ridiomas + a.rvEn + a.rvPt) - (b.ridiomas + b.rvEn + b.rvPt));
const porNivel = Math.ceil(tops.length / NIVEIS.length);
porFama.forEach((j, i) => { j.nivel = NIVEIS[Math.floor(i / porNivel)]; });
for (const j of jogadores) if (j.sec !== 'top') j.nivel = 'lendas';

const saida = jogadores.map(j => {
  const carreira = j.carreira.map(c => c.emp ? [c.id, c.a, c.b, 'emp'] : [c.id, c.a, c.b]);
  const o = { id:slug(j.nome), nome:j.nome, sec:j.sec, nivel:j.nivel, pos:POS[j.pos], pais:j.pais, carreira };
  if (j.ovr) o.ovr = j.ovr;
  if (APELIDOS[j.nome]) o.apelidos = APELIDOS[j.nome];
  return Object.assign(o, CORRECOES[o.id] || {});
});

const hoje = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(ROOT, 'dados.js'),
  `// Gerado por ferramentas/gerar-dados.mjs em ${hoje} a partir da Wikipedia. Não edite à mão.\n` +
  `window.TRAJ = ${JSON.stringify({ atualizado:hoje, clubes, jogadores:saida })};\n`);

// ---- relatório ----
const nomeClube = id => clubes[id]?.n || id;
const rel = [];
for (const j of jogadores) {
  const o = saida.find(s => s.nome === j.nome);
  rel.push(`${j.sec.padEnd(6)} ${j.nome} [${j.pais}] lista:${j.clubeLista || '-'} | wiki:${j.atualWiki}\n   ` +
    o.carreira.map(c => `${nomeClube(c[0])}${c[3] === 'emp' ? '(emp)' : ''} ${c[1]}-${c[2] ?? 'hoje'}`).join(' → '));
}
fs.writeFileSync(path.join(CACHE, 'relatorio.txt'), rel.join('\n'));
console.log(`${saida.length} jogadores, ${Object.keys(clubes).length} clubes, ${semEscudo.length} sem escudo`);
console.log('Avisos:\n ' + (avisos.join('\n ') || 'nenhum'));
console.log('Sem escudo:\n ' + (semEscudo.join('\n ') || 'nenhum'));
console.log('Times B/reserva descartados:\n ' + [...descartados].join(' | '));
fs.writeFileSync(path.join(CACHE, 'clubes.txt'), Object.entries(clubes).map(([id, c]) => `${id} = ${c.n}${c.img ? '' : '   [sem escudo]'}`).sort().join('\n'));
console.log('Relatório completo em ' + path.join(CACHE, 'relatorio.txt'));
console.log('\nNíveis (por fama na Wikipedia en + pt):');
for (const n of NIVEIS) console.log(` ${n.padEnd(8)} ${porFama.filter(j => j.nivel === n).map(j => j.nome).join(', ')}`);
