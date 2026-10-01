// Gera dados.js (carreiras) e baixa os escudos a partir da Wikipedia em inglês.
// Uso:  node ferramentas/gerar-dados.mjs              (usa o cache; só busca jogadores novos)
//       node ferramentas/gerar-dados.mjs --atualizar  (busca tudo de novo: carreiras com as últimas transferências)
// Para adicionar um jogador, inclua uma linha em JOGADORES e rode de novo.
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = path.join(os.tmpdir(), 'trajetoria-cache');
const UA = { 'User-Agent': 'trajetoria-quiz/0.2 (projeto pessoal de fã)' };
const REFRESH = process.argv.includes('--atualizar'); // ignora o cache

// Um jogador por linha: [título na Wikipedia, nome exibido, OVR, posição (sigla), nível]
// Níveis: facil, medio, dificil, insano, lendas (lendas = só aposentados).
// Dentro de cada nível a ordem não importa: o jogo ordena por OVR.
const JOGADORES = [
  // ---- Fácil (33) ----
  ['Lionel Messi', 'Lionel Messi', 99, 'MEI', 'facil'],
  ['Cristiano Ronaldo', 'Cristiano Ronaldo', 98, 'CA', 'facil'],
  ['Neymar', 'Neymar', 96, 'MEI', 'facil'],
  ['Sergio Ramos', 'Sergio Ramos', 94, 'ZAG', 'facil'],
  ['Luis Suárez (Uruguayan footballer)', 'Luis Suárez', 93, 'CA', 'facil'],
  ['Robert Lewandowski', 'Robert Lewandowski', 93, 'CA', 'facil'],
  ['Karim Benzema', 'Karim Benzema', 93, 'CA', 'facil'],
  ['Thiago Silva', 'Thiago Silva', 92, 'ZAG', 'facil'],
  ['Thomas Müller', 'Thomas Müller', 92, 'MEI', 'facil'],
  ['Erling Haaland', 'Erling Haaland', 91, 'ATA', 'facil'],
  ['Kylian Mbappé', 'Kylian Mbappé', 91, 'ATA', 'facil'],
  ['Antoine Griezmann', 'Antoine Griezmann', 91, 'MEI', 'facil'],
  ['Ángel Di María', 'Ángel Di María', 91, 'PE', 'facil'],
  ['Lamine Yamal', 'Lamine Yamal', 90, 'PD', 'facil'],
  ['Jude Bellingham', 'Jude Bellingham', 90, 'MEI', 'facil'],
  ['Pedri', 'Pedri', 90, 'MC', 'facil'],
  ['Michael Olise', 'Michael Olise', 90, 'MD', 'facil'],
  ['Harry Kane', 'Harry Kane', 90, 'ATA', 'facil'],
  ['Thibaut Courtois', 'Thibaut Courtois', 90, 'GL', 'facil'],
  ['Philippe Coutinho', 'Philippe Coutinho', 90, 'PE', 'facil'],
  ['Ousmane Dembélé', 'Ousmane Dembélé', 89, 'ATA', 'facil'],
  ['Vinícius Júnior', 'Vinícius Júnior', 89, 'PE', 'facil'],
  ['Raphinha', 'Raphinha', 88, 'PE', 'facil'],
  ['Virgil van Dijk', 'Virgil van Dijk', 88, 'ZAG', 'facil'],
  ['Rodri (footballer, born 1996)', 'Rodri', 88, 'VOL', 'facil'],
  ['Lautaro Martínez', 'Lautaro Martínez', 87, 'ATA', 'facil'],
  ['Alisson Becker', 'Alisson', 87, 'GL', 'facil'],
  ['Mohamed Salah', 'Mohamed Salah', 87, 'MD', 'facil'],
  ['Julián Alvarez', 'Julián Álvarez', 86, 'ATA', 'facil'],
  ['Paulo Dybala', 'Paulo Dybala', 85, 'MEI', 'facil'],
  ['Kevin De Bruyne', 'Kevin De Bruyne', 85, 'MEI', 'facil'],
  ['Luka Modrić', 'Luka Modrić', 85, 'MC', 'facil'],
  ['Rodrygo', 'Rodrygo', 84, 'PE', 'facil'],
  // ---- Médio (48) ----
  ['Sadio Mané', 'Sadio Mané', 91, 'PE', 'medio'],
  ['N\'Golo Kanté', 'N\'Golo Kanté', 91, 'VOL', 'medio'],
  ['Casemiro', 'Casemiro', 91, 'VOL', 'medio'],
  ['Son Heung-min', 'Son Heung-min', 90, 'PE', 'medio'],
  ['Marco Reus', 'Marco Reus', 90, 'MEI', 'medio'],
  ['Memphis Depay', 'Memphis Depay', 90, 'CA', 'medio'],
  ['Edinson Cavani', 'Edinson Cavani', 90, 'CA', 'medio'],
  ['Paul Pogba', 'Paul Pogba', 90, 'MC', 'medio'],
  ['James Rodríguez', 'James Rodríguez', 89, 'MEI', 'medio'],
  ['Gianluigi Donnarumma', 'Gianluigi Donnarumma', 89, 'GL', 'medio'],
  ['Achraf Hakimi', 'Achraf Hakimi', 88, 'LD', 'medio'],
  ['Declan Rice', 'Declan Rice', 88, 'VOL', 'medio'],
  ['David Raya', 'David Raya', 88, 'GL', 'medio'],
  ['Joshua Kimmich', 'Joshua Kimmich', 88, 'VOL', 'medio'],
  ['Khvicha Kvaratskhelia', 'Khvicha Kvaratskhelia', 87, 'PE', 'medio'],
  ['Bruno Fernandes', 'Bruno Fernandes', 87, 'MC', 'medio'],
  ['Jamal Musiala', 'Jamal Musiala', 87, 'MEI', 'medio'],
  ['Bukayo Saka', 'Bukayo Saka', 87, 'PD', 'medio'],
  ['Rúben Dias', 'Rúben Dias', 87, 'ZAG', 'medio'],
  ['Federico Valverde', 'Federico Valverde', 87, 'MC', 'medio'],
  ['Marquinhos', 'Marquinhos', 87, 'ZAG', 'medio'],
  ['Hulk (footballer)', 'Hulk', 87, 'PE', 'medio'],
  ['Riyad Mahrez', 'Riyad Mahrez', 87, 'PD', 'medio'],
  ['Pau Cubarsí', 'Pau Cubarsí', 86, 'ZAG', 'medio'],
  ['Désiré Doué', 'Désiré Doué', 86, 'PD', 'medio'],
  ['Rayan Cherki', 'Rayan Cherki', 86, 'PD', 'medio'],
  ['Bruno Guimarães', 'Bruno Guimarães', 86, 'MC', 'medio'],
  ['Viktor Gyökeres', 'Viktor Gyökeres', 86, 'ATA', 'medio'],
  ['Marc Cucurella', 'Marc Cucurella', 86, 'LE', 'medio'],
  ['Dominik Szoboszlai', 'Dominik Szoboszlai', 86, 'MEI', 'medio'],
  ['Alexander Isak', 'Alexander Isak', 86, 'ATA', 'medio'],
  ['Frenkie de Jong', 'Frenkie de Jong', 86, 'MC', 'medio'],
  ['Martin Ødegaard', 'Martin Ødegaard', 86, 'MC', 'medio'],
  ['Enzo Fernández', 'Enzo Fernández', 85, 'MC', 'medio'],
  ['Fermín López', 'Fermín López', 85, 'MEI', 'medio'],
  ['Bradley Barcola', 'Bradley Barcola', 85, 'PE', 'medio'],
  ['Cole Palmer', 'Cole Palmer', 85, 'MEI', 'medio'],
  ['Victor Osimhen', 'Victor Osimhen', 85, 'ATA', 'medio'],
  ['Youri Tielemans', 'Youri Tielemans', 85, 'MC', 'medio'],
  ['Morgan Rogers', 'Morgan Rogers', 84, 'MEI', 'medio'],
  ['Nico Williams', 'Nico Williams', 84, 'PE', 'medio'],
  ['Dani Olmo', 'Dani Olmo', 84, 'MEI', 'medio'],
  ['Ferran Torres', 'Ferran Torres', 84, 'CA', 'medio'],
  ['Tijjani Reijnders', 'Tijjani Reijnders', 84, 'MC', 'medio'],
  ['Matheus Cunha', 'Matheus Cunha', 84, 'ME', 'medio'],
  ['Alexis Mac Allister', 'Alexis Mac Allister', 84, 'MC', 'medio'],
  ['Phil Foden', 'Phil Foden', 84, 'MEI', 'medio'],
  ['Ibrahima Konaté', 'Ibrahima Konaté', 84, 'ZAG', 'medio'],
  // ---- Difícil (36) ----
  ['Vitinha (footballer, born 2000)', 'Vitinha', 90, 'MC', 'dificil'],
  ['Nuno Mendes (footballer, born 2002)', 'Nuno Mendes', 89, 'LE', 'dificil'],
  ['Gabriel Magalhães', 'Gabriel Magalhães', 89, 'ZAG', 'dificil'],
  ['João Neves', 'João Neves', 88, 'MC', 'dificil'],
  ['William Saliba', 'William Saliba', 88, 'ZAG', 'dificil'],
  ['Luis Díaz (footballer, born 1997)', 'Luis Díaz', 88, 'ME', 'dificil'],
  ['Jan Oblak', 'Jan Oblak', 88, 'GL', 'dificil'],
  ['Emiliano Martínez', 'Emiliano Martínez', 87, 'GL', 'dificil'],
  ['Joan Garcia', 'Joan García', 86, 'GL', 'dificil'],
  ['Florian Wirtz', 'Florian Wirtz', 86, 'MEI', 'dificil'],
  ['Moisés Caicedo', 'Moisés Caicedo', 86, 'VOL', 'dificil'],
  ['Diogo Costa', 'Diogo Costa', 86, 'GL', 'dificil'],
  ['Fabián Ruiz', 'Fabián Ruiz', 86, 'MC', 'dificil'],
  ['Eric García (footballer, born 2001)', 'Eric García', 85, 'ZAG', 'dificil'],
  ['Jules Koundé', 'Jules Koundé', 85, 'LD', 'dificil'],
  ['Marc Guéhi', 'Marc Guéhi', 85, 'ZAG', 'dificil'],
  ['Sandro Tonali', 'Sandro Tonali', 85, 'VOL', 'dificil'],
  ['Unai Simón', 'Unai Simón', 85, 'GL', 'dificil'],
  ['Marcos Llorente', 'Marcos Llorente', 85, 'LD', 'dificil'],
  ['Alejandro Grimaldo', 'Grimaldo', 85, 'ME', 'dificil'],
  ['Adrien Rabiot', 'Adrien Rabiot', 85, 'MC', 'dificil'],
  ['Hakan Çalhanoğlu', 'Hakan Çalhanoğlu', 85, 'VOL', 'dificil'],
  ['Jordan Pickford', 'Jordan Pickford', 85, 'GL', 'dificil'],
  ['Granit Xhaka', 'Granit Xhaka', 85, 'VOL', 'dificil'],
  ['Aurélien Tchouaméni', 'Aurélien Tchouaméni', 85, 'VOL', 'dificil'],
  ['Kenan Yıldız', 'Kenan Yıldız', 84, 'MEI', 'dificil'],
  ['Elliot Anderson', 'Elliot Anderson', 84, 'VOL', 'dificil'],
  ['Éder Militão', 'Éder Militão', 84, 'ZAG', 'dificil'],
  ['Reece James (footballer, born 1999)', 'Reece James', 84, 'LD', 'dificil'],
  ['Martín Zubimendi', 'Martín Zubimendi', 84, 'VOL', 'dificil'],
  ['Konrad Laimer', 'Konrad Laimer', 84, 'LD', 'dificil'],
  ['Ryan Gravenberch', 'Ryan Gravenberch', 84, 'VOL', 'dificil'],
  ['Joško Gvardiol', 'Joško Gvardiol', 84, 'ZAG', 'dificil'],
  ['Scott McTominay', 'Scott McTominay', 84, 'MC', 'dificil'],
  ['Eberechi Eze', 'Eberechi Eze', 83, 'MEI', 'dificil'],
  // ---- Insano (25) ----
  ['Willian Pacho', 'Willian Pacho', 87, 'ZAG', 'insano'],
  ['Nico Schlotterbeck', 'Nico Schlotterbeck', 86, 'ZAG', 'insano'],
  ['Gregor Kobel', 'Gregor Kobel', 86, 'GL', 'insano'],
  ['Jonathan Tah', 'Jonathan Tah', 86, 'ZAG', 'insano'],
  ['Alessandro Bastoni', 'Alessandro Bastoni', 86, 'ZAG', 'insano'],
  ['Dayot Upamecano', 'Dayot Upamecano', 85, 'ZAG', 'insano'],
  ['Nicolò Barella', 'Nicolò Barella', 85, 'MC', 'insano'],
  ['Mike Maignan', 'Mike Maignan', 85, 'GL', 'insano'],
  ['Gleison Bremer', 'Bremer', 85, 'ZAG', 'insano'],
  ['Federico Dimarco', 'Federico Dimarco', 85, 'LE', 'insano'],
  ['Antoine Semenyo', 'Antoine Semenyo', 85, 'PD', 'insano'],
  ['Serhou Guirassy', 'Serhou Guirassy', 85, 'ATA', 'insano'],
  ['Marco Carnesecchi', 'Marco Carnesecchi', 84, 'GL', 'insano'],
  ['Hugo Ekitike', 'Hugo Ekitiké', 84, 'ATA', 'insano'],
  ['Felix Nmecha', 'Felix Nmecha', 84, 'MC', 'insano'],
  ['Mile Svilar', 'Mile Svilar', 84, 'GL', 'insano'],
  ['Marcus Thuram', 'Marcus Thuram', 84, 'ATA', 'insano'],
  ['Rúben Neves', 'Rúben Neves', 84, 'VOL', 'insano'],
  ['Jurriën Timber', 'Jurriën Timber', 84, 'LD', 'insano'],
  ['Jérémy Doku', 'Jérémy Doku', 84, 'PE', 'insano'],
  ['Bryan Mbeumo', 'Bryan Mbeumo', 84, 'MD', 'insano'],
  ['Boubacar Kamara', 'Boubacar Kamara', 83, 'VOL', 'insano'],
  ['Piero Hincapié', 'Piero Hincapié', 83, 'LE', 'insano'],
  ['Deniz Undav', 'Deniz Undav', 83, 'ATA', 'insano'],
  ['Nico Paz', 'Nico Paz', 83, 'MEI', 'insano'],
  ['Julián Quiñones', 'Julián Quiñones', 82, 'ATA', 'insano'],
  // ---- Lendas (só aposentados) (5) ----
  ['Ronaldo (Brazilian footballer)', 'Ronaldo Nazário', 97, 'CA', 'lendas'],
  ['Ronaldinho', 'Ronaldinho Gaúcho', 95, 'MEI', 'lendas'],
  ['Kaká', 'Kaká', 93, 'MEI', 'lendas'],
  ['Zlatan Ibrahimović', 'Zlatan Ibrahimović', 93, 'CA', 'lendas'],
  ['David Beckham', 'David Beckham', 92, 'MEI', 'lendas'],
];

const APELIDOS = {
  'Cristiano Ronaldo':['cr7','cristiano'], 'Neymar':['neymar jr','ney'], 'Lionel Messi':['messi','leo messi'],
  'Vinícius Júnior':['vini jr','vinicius jr','vini'], 'Ronaldo Nazário':['ronaldo','fenomeno','ronaldo fenomeno','r9'],
  'Ronaldinho Gaúcho':['ronaldinho','r10','dinho'], 'Zlatan Ibrahimović':['ibra','ibrahimovic'],
  'Kylian Mbappé':['mbappe'], 'Erling Haaland':['haaland'], 'Gabriel Magalhães':['gabriel'],
  'Alisson':['alisson becker'], 'Bremer':['gleison bremer'], 'Grimaldo':['alejandro grimaldo'],
  'Fermín López':['fermin'], 'Rodri':['rodrigo hernandez'], 'Hulk':['givanildo'], 'Son Heung-min':['son','sonny'],
};

const POS = { CA:'Centroavante', ATA:'Atacante', PE:'Ponta-esquerda', PD:'Ponta-direita', MEI:'Meia', MC:'Meio-campo', VOL:'Volante',
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

// Escudo escolhido à mão quando a página do clube não traz o escudo como imagem principal (ou traz o errado).
// chave = título da página do clube; valor = nome do arquivo na Wikipedia (sem o "File:")
const ESCUDOS_MANUAIS = {
  'Newcastle United F.C.':'Newcastle United Logo.svg',
};

// Times B / reservas / sub-23 ficam de fora da carreira
const RESERVA = /((?<!Willem)\s(B|C|II|III|2|3)$|\bU-?\d{2}\b|Under-\d{2}|Reserves|Next Gen|Castilla|\sAtl[eéè]tic(o)?$|Mestalla|Bilbao Athletic|Betis Deportivo|Celta Fortuna|^Jong\s|Academy|Primavera|Juvenil|\(youth\))/i;

// Ajustes manuais pontuais (preenchidos após conferir a saída)
const CORRECOES = {
  'marco-carnesecchi': { pais:'Itália' }, // ainda sem jogo pela seleção principal
};

/* ------------------------------------------------------------------ */
const sleep = ms => new Promise(r => setTimeout(r, ms));
// letras que não se decompõem no NFD (ø, ı, æ…) viram a letra simples: Ødegaard → odegaard, Yıldız → yildiz
const SIMPLES = { ø:'o', Ø:'o', ı:'i', İ:'i', æ:'ae', Æ:'ae', œ:'oe', Œ:'oe', ß:'ss', đ:'d', Đ:'d', ł:'l', Ł:'l', ð:'d', þ:'th' };
const slug = s => s.replace(/[øØıİæÆœŒßđĐłŁðþ]/g, c => SIMPLES[c]).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

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
const NIVEIS = ['facil', 'medio', 'dificil', 'insano', 'lendas'];
const lista = JOGADORES.map(([t, nome, ovr, pos, nivel]) => {
  if (!NIVEIS.includes(nivel)) throw new Error(`nível inválido para ${nome}: "${nivel}" (use ${NIVEIS.join(', ')})`);
  if (!POS[pos]) throw new Error(`posição inválida para ${nome}: "${pos}" (use ${Object.keys(POS).join(', ')})`);
  return { t, nome, ovr, pos, nivel };
});

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
  if (j.nivel === 'lendas' && senior.some(c => c.b === null)) avisos.push(`LENDA AINDA EM ATIVIDADE segundo a Wikipedia: ${j.nome} (${senior.find(c => c.b === null).text} ${senior.find(c => c.b === null).a}–hoje)`);
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
const manuais = Object.entries(ESCUDOS_MANUAIS);
if (manuais.length) {
  const d = await api({ action:'query', prop:'imageinfo', iiprop:'url', iiurlwidth:'160', titles:manuais.map(([, arq]) => 'File:' + arq).join('|') });
  for (const [clube, arq] of manuais) {
    const p = d.query.pages.find(x => x.title === 'File:' + arq);
    if (p?.imageinfo) imagens[clube] = p.imageinfo[0].thumburl;
    else avisos.push(`ESCUDO MANUAL NÃO ENCONTRADO: ${arq} (${clube})`);
  }
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

const saida = jogadores.map(j => {
  const carreira = j.carreira.map(c => c.emp ? [c.id, c.a, c.b, 'emp'] : [c.id, c.a, c.b]);
  const o = { id:slug(j.nome), nome:j.nome, nivel:j.nivel, ovr:j.ovr, pos:POS[j.pos], pais:j.pais, carreira };
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
  rel.push(`${j.nivel.padEnd(8)} ${j.nome} (${j.ovr} ${j.pos}) [${j.pais}] clube atual na Wikipedia: ${j.atualWiki}\n   ` +
    o.carreira.map(c => `${nomeClube(c[0])}${c[3] === 'emp' ? '(emp)' : ''} ${c[1]}-${c[2] ?? 'hoje'}`).join(' → '));
}
fs.writeFileSync(path.join(CACHE, 'relatorio.txt'), rel.join('\n'));
console.log(`${saida.length} jogadores, ${Object.keys(clubes).length} clubes, ${semEscudo.length} sem escudo`);
console.log('Avisos:\n ' + (avisos.join('\n ') || 'nenhum'));
console.log('Sem escudo:\n ' + (semEscudo.join('\n ') || 'nenhum'));
console.log('Times B/reserva descartados:\n ' + [...descartados].join(' | '));
fs.writeFileSync(path.join(CACHE, 'clubes.txt'), Object.entries(clubes).map(([id, c]) => `${id} = ${c.n}${c.img ? '' : '   [sem escudo]'}`).sort().join('\n'));
console.log('Relatório completo em ' + path.join(CACHE, 'relatorio.txt'));
console.log('\nJogadores por nível:');
for (const n of NIVEIS) console.log(` ${n.padEnd(8)} ${saida.filter(j => j.nivel === n).length}`);
