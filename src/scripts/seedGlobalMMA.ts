/**
 * Seeding-Script: 200 reale MMA-Kämpfer in Payload CMS
 *
 * Organisationen:
 * - UFC: ~80 Kämpfer (Top-Rankings)
 * - PFL & Bellator: ~50 Kämpfer
 * - Oktagon MMA: ~40 Kämpfer
 * - KSW: ~30 Kämpfer
 *
 * Physische Attribute (dateOfBirth, height, reach, legReach):
 * - Top-Kämpfer: Reale Werte aus Sherdog/UFC.com
 * - Rest: Gewichtsklassen-basierte Defaults
 * - legReach: Leer/undefined → Frontend zeigt "-"
 *
 * Ausführung (neues Terminal, Dev-Server kann laufen):
 *   npm run seed:global-mma
 *
 * Oder direkt (stellt sicher, dass .env geladen wird):
 *   npx tsx src/scripts/seedGlobalMMA.ts
 *
 * Voraussetzung: .env im Projekt-Root mit PAYLOAD_SECRET und DATABASE_URL.
 */

import dotenv from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

// .env aus Projekt-Root laden (unabhängig von process.cwd())
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..', '..')
dotenv.config({ path: path.join(root, '.env') })
import { getPayload } from 'payload'

const WEIGHT_CLASSES = [
  'Strawweight (bis 52 kg)',
  'Flyweight (bis 57 kg)',
  'Bantamweight (bis 61 kg)',
  'Featherweight (bis 66 kg)',
  'Lightweight (bis 70 kg)',
  'Welterweight (bis 77 kg)',
  'Middleweight (bis 84 kg)',
  'Light Heavyweight (bis 93 kg)',
  'Heavyweight (bis 120 kg)',
] as const

type FighterSeed = {
  name: string
  nickname: string
  wins: number
  losses: number
  draws: number
  weightClass: (typeof WEIGHT_CLASSES)[number]
  gender: 'male' | 'female'
  slug: string
  organisation: string
}

/** Physische Attribute: dateOfBirth (ISO), height/reach/legReach in cm. Leer = Fallback für Frontend (-) */
type PhysicalStats = {
  dateOfBirth?: string
  height?: string
  reach?: string
  legReach?: string
}

/** Reale Werte für Top-Kämpfer (UFC, KSW, Oktagon). Quelle: Sherdog, UFC.com, Tapology */
const PHYSICAL_STATS: Record<string, PhysicalStats> = {
  'islam-makhachev': { dateOfBirth: '1991-10-27', height: '178', reach: '178', legReach: '' },
  'leon-edwards': { dateOfBirth: '1991-08-25', height: '183', reach: '188', legReach: '' },
  'ilia-topuria': { dateOfBirth: '1997-01-21', height: '175', reach: '178', legReach: '' },
  'sean-omalley': { dateOfBirth: '1994-10-24', height: '180', reach: '183', legReach: '' },
  'alexandre-pantoja': { dateOfBirth: '1990-04-16', height: '165', reach: '165', legReach: '' },
  'dricus-du-plessis': { dateOfBirth: '1994-01-11', height: '183', reach: '183', legReach: '' },
  'alex-pereira': { dateOfBirth: '1987-07-07', height: '193', reach: '201', legReach: '' },
  'tom-aspinall': { dateOfBirth: '1993-04-11', height: '196', reach: '198', legReach: '' },
  'max-holloway': { dateOfBirth: '1991-12-04', height: '180', reach: '175', legReach: '' },
  'jon-jones': { dateOfBirth: '1987-07-19', height: '198', reach: '215', legReach: '' },
  'charles-oliveira': { dateOfBirth: '1989-10-17', height: '178', reach: '188', legReach: '' },
  'israel-adesanya': { dateOfBirth: '1989-07-22', height: '193', reach: '203', legReach: '' },
  'jiri-prochazka': { dateOfBirth: '1992-10-14', height: '193', reach: '203', legReach: '' },
  'shavkat-rakhmonov': { dateOfBirth: '1994-10-23', height: '183', reach: '188', legReach: '' },
  'khamzat-chimaev': { dateOfBirth: '1994-05-01', height: '188', reach: '190', legReach: '' },
  'ciryl-gane': { dateOfBirth: '1990-04-12', height: '196', reach: '206', legReach: '' },
  'conor-mcgregor': { dateOfBirth: '1988-07-14', height: '175', reach: '188', legReach: '' },
  'khabib-nurmagomedov': { dateOfBirth: '1988-09-20', height: '178', reach: '178', legReach: '' },
  'zhang-weili': { dateOfBirth: '1989-08-13', height: '163', reach: '160', legReach: '' },
  'valentina-shevchenko': { dateOfBirth: '1988-03-07', height: '165', reach: '165', legReach: '' },
  'cedric-doumbe': { dateOfBirth: '1992-08-30', height: '183', reach: '188', legReach: '' },
  'patricio-pitbull': { dateOfBirth: '1987-07-07', height: '165', reach: '175', legReach: '' },
  'vadim-nemkov': { dateOfBirth: '1992-06-20', height: '183', reach: '193', legReach: '' },
  'johnny-eblen': { dateOfBirth: '1991-12-04', height: '180', reach: '188', legReach: '' },
  'kayla-harrison': { dateOfBirth: '1990-07-02', height: '173', reach: '175', legReach: '' },
  'cris-cyborg': { dateOfBirth: '1985-07-09', height: '168', reach: '168', legReach: '' },
  'patrik-kincl': { dateOfBirth: '1989-06-22', height: '183', reach: '188', legReach: '' },
  'losene-keita': { dateOfBirth: '1998-03-15', height: '175', reach: '180', legReach: '' },
  'david-kozma': { dateOfBirth: '1990-04-20', height: '183', reach: '188', legReach: '' },
  'salahdine-parnasse': { dateOfBirth: '1997-09-15', height: '175', reach: '178', legReach: '' },
  'mamed-khalidov': { dateOfBirth: '1980-06-17', height: '183', reach: '188', legReach: '' },
  'phil-de-fries': { dateOfBirth: '1986-07-16', height: '191', reach: '196', legReach: '' },
  'mariusz-pudzianowski': { dateOfBirth: '1977-02-07', height: '186', reach: '193', legReach: '' },
  'roberto-soldic': { dateOfBirth: '1995-03-25', height: '178', reach: '183', legReach: '' },
  'martin-zawada': { dateOfBirth: '1986-08-12', height: '188', reach: '193', legReach: '' },
  'martin-zawada-ksw': { dateOfBirth: '1986-08-12', height: '188', reach: '193', legReach: '' },
}

/** Gewichtsklassen-basierte Defaults für Kämpfer ohne reale Daten */
function getDefaultPhysical(
  weightClass: string,
  gender: 'male' | 'female'
): PhysicalStats {
  const defaults: Record<string, { h: number; r: number }> = {
    'Strawweight (bis 52 kg)': { h: gender === 'female' ? 160 : 163, r: gender === 'female' ? 165 : 168 },
    'Flyweight (bis 57 kg)': { h: 165, r: 170 },
    'Bantamweight (bis 61 kg)': { h: 168, r: 173 },
    'Featherweight (bis 66 kg)': { h: 172, r: 178 },
    'Lightweight (bis 70 kg)': { h: 175, r: 180 },
    'Welterweight (bis 77 kg)': { h: 178, r: 183 },
    'Middleweight (bis 84 kg)': { h: 183, r: 188 },
    'Light Heavyweight (bis 93 kg)': { h: 188, r: 193 },
    'Heavyweight (bis 120 kg)': { h: 190, r: 198 },
  }
  const d = defaults[weightClass] ?? { h: 178, r: 183 }
  return {
    dateOfBirth: '1990-06-15',
    height: String(d.h),
    reach: String(d.r),
    legReach: '',
  }
}

const FIGHTERS: FighterSeed[] = [
  // ========== UFC (~80) ==========
  { name: 'Islam Makhachev', nickname: '', wins: 26, losses: 1, draws: 0, weightClass: 'Lightweight (bis 70 kg)', gender: 'male', slug: 'islam-makhachev', organisation: 'UFC' },
  { name: 'Leon Edwards', nickname: 'Rocky', wins: 22, losses: 3, draws: 0, weightClass: 'Welterweight (bis 77 kg)', gender: 'male', slug: 'leon-edwards', organisation: 'UFC' },
  { name: 'Ilia Topuria', nickname: 'El Matador', wins: 15, losses: 0, draws: 0, weightClass: 'Featherweight (bis 66 kg)', gender: 'male', slug: 'ilia-topuria', organisation: 'UFC' },
  { name: 'Sean O\'Malley', nickname: 'Suga', wins: 18, losses: 2, draws: 0, weightClass: 'Bantamweight (bis 61 kg)', gender: 'male', slug: 'sean-omalley', organisation: 'UFC' },
  { name: 'Alexandre Pantoja', nickname: 'The Cannibal', wins: 28, losses: 5, draws: 0, weightClass: 'Flyweight (bis 57 kg)', gender: 'male', slug: 'alexandre-pantoja', organisation: 'UFC' },
  { name: 'Dricus Du Plessis', nickname: 'Stillknocks', wins: 22, losses: 2, draws: 0, weightClass: 'Middleweight (bis 84 kg)', gender: 'male', slug: 'dricus-du-plessis', organisation: 'UFC' },
  { name: 'Alex Pereira', nickname: 'Poatan', wins: 11, losses: 2, draws: 0, weightClass: 'Light Heavyweight (bis 93 kg)', gender: 'male', slug: 'alex-pereira', organisation: 'UFC' },
  { name: 'Tom Aspinall', nickname: '', wins: 15, losses: 3, draws: 0, weightClass: 'Heavyweight (bis 120 kg)', gender: 'male', slug: 'tom-aspinall', organisation: 'UFC' },
  { name: 'Max Holloway', nickname: 'Blessed', wins: 26, losses: 8, draws: 0, weightClass: 'Featherweight (bis 66 kg)', gender: 'male', slug: 'max-holloway', organisation: 'UFC' },
  { name: 'Merab Dvalishvili', nickname: 'The Machine', wins: 18, losses: 4, draws: 0, weightClass: 'Bantamweight (bis 61 kg)', gender: 'male', slug: 'merab-dvalishvili', organisation: 'UFC' },
  { name: 'Belal Muhammad', nickname: 'Remember The Name', wins: 24, losses: 3, draws: 1, weightClass: 'Welterweight (bis 77 kg)', gender: 'male', slug: 'belal-muhammad', organisation: 'UFC' },
  { name: 'Charles Oliveira', nickname: 'Do Bronx', wins: 34, losses: 10, draws: 0, weightClass: 'Lightweight (bis 70 kg)', gender: 'male', slug: 'charles-oliveira', organisation: 'UFC' },
  { name: 'Israel Adesanya', nickname: 'The Last Stylebender', wins: 24, losses: 3, draws: 0, weightClass: 'Middleweight (bis 84 kg)', gender: 'male', slug: 'israel-adesanya', organisation: 'UFC' },
  { name: 'Jiri Prochazka', nickname: 'BJP', wins: 30, losses: 4, draws: 1, weightClass: 'Light Heavyweight (bis 93 kg)', gender: 'male', slug: 'jiri-prochazka', organisation: 'UFC' },
  { name: 'Jon Jones', nickname: 'Bones', wins: 27, losses: 1, draws: 0, weightClass: 'Heavyweight (bis 120 kg)', gender: 'male', slug: 'jon-jones', organisation: 'UFC' },
  { name: 'Sean Strickland', nickname: 'Tarzan', wins: 29, losses: 6, draws: 0, weightClass: 'Middleweight (bis 84 kg)', gender: 'male', slug: 'sean-strickland', organisation: 'UFC' },
  { name: 'Shavkat Rakhmonov', nickname: 'Nomad', wins: 18, losses: 0, draws: 0, weightClass: 'Welterweight (bis 77 kg)', gender: 'male', slug: 'shavkat-rakhmonov', organisation: 'UFC' },
  { name: 'Justin Gaethje', nickname: 'The Highlight', wins: 26, losses: 4, draws: 0, weightClass: 'Lightweight (bis 70 kg)', gender: 'male', slug: 'justin-gaethje', organisation: 'UFC' },
  { name: 'Brian Ortega', nickname: 'T-City', wins: 16, losses: 4, draws: 0, weightClass: 'Featherweight (bis 66 kg)', gender: 'male', slug: 'brian-ortega', organisation: 'UFC' },
  { name: 'Aljamain Sterling', nickname: 'Funk Master', wins: 24, losses: 4, draws: 0, weightClass: 'Bantamweight (bis 61 kg)', gender: 'male', slug: 'aljamain-sterling', organisation: 'UFC' },
  { name: 'Brandon Moreno', nickname: 'The Assassin Baby', wins: 21, losses: 8, draws: 2, weightClass: 'Flyweight (bis 57 kg)', gender: 'male', slug: 'brandon-moreno', organisation: 'UFC' },
  { name: 'Robert Whittaker', nickname: 'The Reaper', wins: 26, losses: 7, draws: 0, weightClass: 'Middleweight (bis 84 kg)', gender: 'male', slug: 'robert-whittaker', organisation: 'UFC' },
  { name: 'Jamahal Hill', nickname: 'Sweet Dreams', wins: 12, losses: 2, draws: 0, weightClass: 'Light Heavyweight (bis 93 kg)', gender: 'male', slug: 'jamahal-hill', organisation: 'UFC' },
  { name: 'Sergei Pavlovich', nickname: '', wins: 19, losses: 2, draws: 0, weightClass: 'Heavyweight (bis 120 kg)', gender: 'male', slug: 'sergei-pavlovich', organisation: 'UFC' },
  { name: 'Colby Covington', nickname: 'Chaos', wins: 17, losses: 4, draws: 0, weightClass: 'Welterweight (bis 77 kg)', gender: 'male', slug: 'colby-covington', organisation: 'UFC' },
  { name: 'Dustin Poirier', nickname: 'The Diamond', wins: 30, losses: 9, draws: 0, weightClass: 'Lightweight (bis 70 kg)', gender: 'male', slug: 'dustin-poirier', organisation: 'UFC' },
  { name: 'Movsar Evloev', nickname: '', wins: 18, losses: 0, draws: 0, weightClass: 'Featherweight (bis 66 kg)', gender: 'male', slug: 'movsar-evloev', organisation: 'UFC' },
  { name: 'Umar Nurmagomedov', nickname: '', wins: 18, losses: 0, draws: 0, weightClass: 'Bantamweight (bis 61 kg)', gender: 'male', slug: 'umar-nurmagomedov', organisation: 'UFC' },
  { name: 'Brandon Royval', nickname: 'Raw Dog', wins: 16, losses: 7, draws: 0, weightClass: 'Flyweight (bis 57 kg)', gender: 'male', slug: 'brandon-royval', organisation: 'UFC' },
  { name: 'Khamzat Chimaev', nickname: 'Borz', wins: 13, losses: 0, draws: 0, weightClass: 'Middleweight (bis 84 kg)', gender: 'male', slug: 'khamzat-chimaev', organisation: 'UFC' },
  { name: 'Magomed Ankalaev', nickname: '', wins: 18, losses: 2, draws: 1, weightClass: 'Light Heavyweight (bis 93 kg)', gender: 'male', slug: 'magomed-ankalaev', organisation: 'UFC' },
  { name: 'Curtis Blaydes', nickname: 'Razor', wins: 18, losses: 4, draws: 0, weightClass: 'Heavyweight (bis 120 kg)', gender: 'male', slug: 'curtis-blaydes', organisation: 'UFC' },
  { name: 'Ian Machado Garry', nickname: 'The Future', wins: 15, losses: 0, draws: 0, weightClass: 'Welterweight (bis 77 kg)', gender: 'male', slug: 'ian-machado-garry', organisation: 'UFC' },
  { name: 'Arman Tsarukyan', nickname: 'Ahalkalakets', wins: 22, losses: 3, draws: 0, weightClass: 'Lightweight (bis 70 kg)', gender: 'male', slug: 'arman-tsarukyan', organisation: 'UFC' },
  { name: 'Max Holloway', nickname: 'Blessed', wins: 26, losses: 8, draws: 0, weightClass: 'Lightweight (bis 70 kg)', gender: 'male', slug: 'max-holloway-lw', organisation: 'UFC' },
  { name: 'Aljamain Sterling', nickname: 'Funk Master', wins: 24, losses: 4, draws: 0, weightClass: 'Featherweight (bis 66 kg)', gender: 'male', slug: 'aljamain-sterling-fw', organisation: 'UFC' },
  { name: 'Cory Sandhagen', nickname: 'The Sandman', wins: 17, losses: 4, draws: 0, weightClass: 'Bantamweight (bis 61 kg)', gender: 'male', slug: 'cory-sandhagen', organisation: 'UFC' },
  { name: 'Muhammad Mokaev', nickname: 'The Punisher', wins: 12, losses: 0, draws: 0, weightClass: 'Flyweight (bis 57 kg)', gender: 'male', slug: 'muhammad-mokaev', organisation: 'UFC' },
  { name: 'Paulo Costa', nickname: 'The Eraser', wins: 14, losses: 3, draws: 0, weightClass: 'Middleweight (bis 84 kg)', gender: 'male', slug: 'paulo-costa', organisation: 'UFC' },
  { name: 'Jan Blachowicz', nickname: 'Prince of Cieszyn', wins: 29, losses: 10, draws: 1, weightClass: 'Light Heavyweight (bis 93 kg)', gender: 'male', slug: 'jan-blachowicz', organisation: 'UFC' },
  { name: 'Ciryl Gane', nickname: 'Bon Gamin', wins: 11, losses: 2, draws: 0, weightClass: 'Heavyweight (bis 120 kg)', gender: 'male', slug: 'ciryl-gane', organisation: 'UFC' },
  { name: 'Jack Della Maddalena', nickname: '', wins: 17, losses: 2, draws: 0, weightClass: 'Welterweight (bis 77 kg)', gender: 'male', slug: 'jack-della-maddalena', organisation: 'UFC' },
  { name: 'Beneil Dariush', nickname: '', wins: 22, losses: 7, draws: 1, weightClass: 'Lightweight (bis 70 kg)', gender: 'male', slug: 'beneil-dariush', organisation: 'UFC' },
  { name: 'Yair Rodriguez', nickname: 'El Pantera', wins: 16, losses: 5, draws: 0, weightClass: 'Featherweight (bis 66 kg)', gender: 'male', slug: 'yair-rodriguez', organisation: 'UFC' },
  { name: 'Marlon Vera', nickname: 'Chito', wins: 23, losses: 9, draws: 0, weightClass: 'Bantamweight (bis 61 kg)', gender: 'male', slug: 'marlon-vera', organisation: 'UFC' },
  { name: 'Kai Kara-France', nickname: 'Don\'t Blink', wins: 24, losses: 7, draws: 0, weightClass: 'Flyweight (bis 57 kg)', gender: 'male', slug: 'kai-kara-france', organisation: 'UFC' },
  { name: 'Brendan Allen', nickname: 'All In', wins: 24, losses: 5, draws: 0, weightClass: 'Middleweight (bis 84 kg)', gender: 'male', slug: 'brendan-allen', organisation: 'UFC' },
  { name: 'Johnny Walker', nickname: '', wins: 21, losses: 8, draws: 0, weightClass: 'Light Heavyweight (bis 93 kg)', gender: 'male', slug: 'johnny-walker', organisation: 'UFC' },
  { name: 'Alexander Volkov', nickname: 'Drago', wins: 37, losses: 10, draws: 0, weightClass: 'Heavyweight (bis 120 kg)', gender: 'male', slug: 'alexander-volkov', organisation: 'UFC' },
  { name: 'Geoff Neal', nickname: 'Handz of Steel', wins: 15, losses: 5, draws: 0, weightClass: 'Welterweight (bis 77 kg)', gender: 'male', slug: 'geoff-neal', organisation: 'UFC' },
  { name: 'Rafael Fiziev', nickname: 'Ataman', wins: 12, losses: 3, draws: 0, weightClass: 'Lightweight (bis 70 kg)', gender: 'male', slug: 'rafael-fiziev', organisation: 'UFC' },
  { name: 'Bryce Mitchell', nickname: 'Thug Nasty', wins: 16, losses: 2, draws: 0, weightClass: 'Featherweight (bis 66 kg)', gender: 'male', slug: 'bryce-mitchell', organisation: 'UFC' },
  { name: 'Song Yadong', nickname: 'Kung Fu Kid', wins: 21, losses: 8, draws: 1, weightClass: 'Bantamweight (bis 61 kg)', gender: 'male', slug: 'song-yadong', organisation: 'UFC' },
  { name: 'Tatsuro Taira', nickname: '', wins: 16, losses: 0, draws: 0, weightClass: 'Flyweight (bis 57 kg)', gender: 'male', slug: 'tatsuro-taira', organisation: 'UFC' },
  { name: 'Nassourdine Imavov', nickname: '', wins: 13, losses: 4, draws: 0, weightClass: 'Middleweight (bis 84 kg)', gender: 'male', slug: 'nassourdine-imavov', organisation: 'UFC' },
  { name: 'Nikita Krylov', nickname: 'The Miner', wins: 30, losses: 10, draws: 0, weightClass: 'Light Heavyweight (bis 93 kg)', gender: 'male', slug: 'nikita-krylov', organisation: 'UFC' },
  { name: 'Marcin Tybura', nickname: 'Tybur', wins: 25, losses: 8, draws: 0, weightClass: 'Heavyweight (bis 120 kg)', gender: 'male', slug: 'marcin-tybura', organisation: 'UFC' },
  { name: 'Michael Page', nickname: 'Venom', wins: 22, losses: 2, draws: 0, weightClass: 'Welterweight (bis 77 kg)', gender: 'male', slug: 'michael-page', organisation: 'UFC' },
  { name: 'Dan Hooker', nickname: 'The Hangman', wins: 23, losses: 12, draws: 0, weightClass: 'Lightweight (bis 70 kg)', gender: 'male', slug: 'dan-hooker', organisation: 'UFC' },
  { name: 'Edson Barboza', nickname: 'Junior', wins: 24, losses: 12, draws: 0, weightClass: 'Featherweight (bis 66 kg)', gender: 'male', slug: 'edson-barboza', organisation: 'UFC' },
  { name: 'Deiveson Figueiredo', nickname: 'Deus da Guerra', wins: 22, losses: 4, draws: 1, weightClass: 'Bantamweight (bis 61 kg)', gender: 'male', slug: 'deiveson-figueiredo', organisation: 'UFC' },
  { name: 'Manel Kape', nickname: 'Starboy', wins: 19, losses: 6, draws: 0, weightClass: 'Flyweight (bis 57 kg)', gender: 'male', slug: 'manel-kape', organisation: 'UFC' },
  { name: 'Jared Cannonier', nickname: 'The Killa Gorilla', wins: 17, losses: 6, draws: 0, weightClass: 'Middleweight (bis 84 kg)', gender: 'male', slug: 'jared-cannonier', organisation: 'UFC' },
  { name: 'Anthony Smith', nickname: 'Lionheart', wins: 38, losses: 19, draws: 0, weightClass: 'Light Heavyweight (bis 93 kg)', gender: 'male', slug: 'anthony-smith', organisation: 'UFC' },
  { name: 'Jairzinho Rozenstruik', nickname: 'Bigi Boy', wins: 14, losses: 6, draws: 0, weightClass: 'Heavyweight (bis 120 kg)', gender: 'male', slug: 'jairzinho-rozenstruik', organisation: 'UFC' },
  { name: 'Kevin Holland', nickname: 'Trailblazer', wins: 25, losses: 11, draws: 0, weightClass: 'Welterweight (bis 77 kg)', gender: 'male', slug: 'kevin-holland', organisation: 'UFC' },
  { name: 'Bobby Green', nickname: 'King', wins: 32, losses: 15, draws: 1, weightClass: 'Lightweight (bis 70 kg)', gender: 'male', slug: 'bobby-green', organisation: 'UFC' },
  { name: 'Sodiq Yusuff', nickname: 'Super', wins: 13, losses: 4, draws: 0, weightClass: 'Featherweight (bis 66 kg)', gender: 'male', slug: 'sodiq-yusuff', organisation: 'UFC' },
  { name: 'Petr Yan', nickname: 'No Mercy', wins: 17, losses: 6, draws: 0, weightClass: 'Bantamweight (bis 61 kg)', gender: 'male', slug: 'petr-yan', organisation: 'UFC' },
  { name: 'Amir Albazi', nickname: 'The Prince', wins: 17, losses: 1, draws: 0, weightClass: 'Flyweight (bis 57 kg)', gender: 'male', slug: 'amir-albazi', organisation: 'UFC' },
  { name: 'Roman Dolidze', nickname: 'The Caucasian', wins: 12, losses: 3, draws: 0, weightClass: 'Middleweight (bis 84 kg)', gender: 'male', slug: 'roman-dolidze', organisation: 'UFC' },
  { name: 'Ryan Spann', nickname: 'Superman', wins: 21, losses: 10, draws: 0, weightClass: 'Light Heavyweight (bis 93 kg)', gender: 'male', slug: 'ryan-spann', organisation: 'UFC' },
  { name: 'Tai Tuivasa', nickname: 'Bam Bam', wins: 15, losses: 7, draws: 0, weightClass: 'Heavyweight (bis 120 kg)', gender: 'male', slug: 'tai-tuivasa', organisation: 'UFC' },
  { name: 'Kevin Gastelum', nickname: 'KG', wins: 18, losses: 9, draws: 0, weightClass: 'Middleweight (bis 84 kg)', gender: 'male', slug: 'kevin-gastelum', organisation: 'UFC' },
  { name: 'Paddy Pimblett', nickname: 'The Baddy', wins: 21, losses: 3, draws: 0, weightClass: 'Lightweight (bis 70 kg)', gender: 'male', slug: 'paddy-pimblett', organisation: 'UFC' },
  { name: 'Giga Chikadze', nickname: 'Ninja', wins: 15, losses: 4, draws: 0, weightClass: 'Featherweight (bis 66 kg)', gender: 'male', slug: 'giga-chikadze', organisation: 'UFC' },
  { name: 'Henry Cejudo', nickname: 'The Messenger', wins: 16, losses: 4, draws: 0, weightClass: 'Bantamweight (bis 61 kg)', gender: 'male', slug: 'henry-cejudo', organisation: 'UFC' },
  { name: 'Alex Perez', nickname: '', wins: 25, losses: 8, draws: 0, weightClass: 'Flyweight (bis 57 kg)', gender: 'male', slug: 'alex-perez', organisation: 'UFC' },
  { name: 'Marvin Vettori', nickname: 'The Italian Dream', wins: 19, losses: 7, draws: 1, weightClass: 'Middleweight (bis 84 kg)', gender: 'male', slug: 'marvin-vettori', organisation: 'UFC' },
  { name: 'Khalil Rountree', nickname: 'The War Horse', wins: 13, losses: 5, draws: 0, weightClass: 'Light Heavyweight (bis 93 kg)', gender: 'male', slug: 'khalil-rountree', organisation: 'UFC' },
  { name: 'Derrick Lewis', nickname: 'The Black Beast', wins: 27, losses: 12, draws: 0, weightClass: 'Heavyweight (bis 120 kg)', gender: 'male', slug: 'derrick-lewis', organisation: 'UFC' },
  // UFC Women
  { name: 'Alexa Grasso', nickname: '', wins: 16, losses: 3, draws: 1, weightClass: 'Flyweight (bis 57 kg)', gender: 'female', slug: 'alexa-grasso', organisation: 'UFC' },
  { name: 'Zhang Weili', nickname: 'Magnum', wins: 25, losses: 3, draws: 0, weightClass: 'Strawweight (bis 52 kg)', gender: 'female', slug: 'zhang-weili', organisation: 'UFC' },
  { name: 'Raquel Pennington', nickname: 'Rocky', wins: 16, losses: 10, draws: 0, weightClass: 'Bantamweight (bis 61 kg)', gender: 'female', slug: 'raquel-pennington', organisation: 'UFC' },
  { name: 'Valentina Shevchenko', nickname: 'Bullet', wins: 23, losses: 4, draws: 0, weightClass: 'Flyweight (bis 57 kg)', gender: 'female', slug: 'valentina-shevchenko', organisation: 'UFC' },
  { name: 'Rose Namajunas', nickname: 'Thug', wins: 12, losses: 6, draws: 0, weightClass: 'Strawweight (bis 52 kg)', gender: 'female', slug: 'rose-namajunas', organisation: 'UFC' },
  { name: 'Tatiana Suarez', nickname: '', wins: 11, losses: 0, draws: 0, weightClass: 'Strawweight (bis 52 kg)', gender: 'female', slug: 'tatiana-suarez', organisation: 'UFC' },
  { name: 'Maycee Barber', nickname: 'The Future', wins: 14, losses: 2, draws: 0, weightClass: 'Flyweight (bis 57 kg)', gender: 'female', slug: 'maycee-barber', organisation: 'UFC' },
  { name: 'Manon Fiorot', nickname: 'The Beast', wins: 12, losses: 1, draws: 0, weightClass: 'Flyweight (bis 57 kg)', gender: 'female', slug: 'manon-fiorot', organisation: 'UFC' },
  { name: 'Julianna Pena', nickname: 'The Venezuelan Vixen', wins: 12, losses: 6, draws: 0, weightClass: 'Bantamweight (bis 61 kg)', gender: 'female', slug: 'julianna-pena', organisation: 'UFC' },
  { name: 'Yan Xiaonan', nickname: 'Fury', wins: 18, losses: 3, draws: 0, weightClass: 'Strawweight (bis 52 kg)', gender: 'female', slug: 'yan-xiaonan', organisation: 'UFC' },
  { name: 'Conor McGregor', nickname: 'The Notorious', wins: 22, losses: 6, draws: 0, weightClass: 'Lightweight (bis 70 kg)', gender: 'male', slug: 'conor-mcgregor', organisation: 'UFC' },
  { name: 'Khabib Nurmagomedov', nickname: 'The Eagle', wins: 29, losses: 0, draws: 0, weightClass: 'Lightweight (bis 70 kg)', gender: 'male', slug: 'khabib-nurmagomedov', organisation: 'UFC' },

  // ========== PFL & Bellator (~50) ==========
  { name: 'Cedric Doumbe', nickname: 'The Best', wins: 5, losses: 1, draws: 0, weightClass: 'Welterweight (bis 77 kg)', gender: 'male', slug: 'cedric-doumbe', organisation: 'PFL' },
  { name: 'Patricio Pitbull', nickname: 'Pitbull', wins: 36, losses: 7, draws: 0, weightClass: 'Featherweight (bis 66 kg)', gender: 'male', slug: 'patricio-pitbull', organisation: 'Bellator' },
  { name: 'Vadim Nemkov', nickname: '', wins: 17, losses: 2, draws: 0, weightClass: 'Light Heavyweight (bis 93 kg)', gender: 'male', slug: 'vadim-nemkov', organisation: 'Bellator' },
  { name: 'Ryan Bader', nickname: 'Darth', wins: 31, losses: 7, draws: 0, weightClass: 'Heavyweight (bis 120 kg)', gender: 'male', slug: 'ryan-bader', organisation: 'Bellator' },
  { name: 'Johnny Eblen', nickname: 'The Human Cheat Code', wins: 15, losses: 0, draws: 0, weightClass: 'Middleweight (bis 84 kg)', gender: 'male', slug: 'johnny-eblen', organisation: 'Bellator' },
  { name: 'Patchy Mix', nickname: 'No Love', wins: 19, losses: 2, draws: 0, weightClass: 'Bantamweight (bis 61 kg)', gender: 'male', slug: 'patchy-mix', organisation: 'Bellator' },
  { name: 'Usman Nurmagomedov', nickname: '', wins: 18, losses: 0, draws: 0, weightClass: 'Lightweight (bis 70 kg)', gender: 'male', slug: 'usman-nurmagomedov', organisation: 'Bellator' },
  { name: 'Jason Jackson', nickname: 'The Ass-Kicking Machine', wins: 18, losses: 4, draws: 0, weightClass: 'Welterweight (bis 77 kg)', gender: 'male', slug: 'jason-jackson', organisation: 'Bellator' },
  { name: 'Magomed Magomedov', nickname: 'Tiger', wins: 20, losses: 3, draws: 0, weightClass: 'Bantamweight (bis 61 kg)', gender: 'male', slug: 'magomed-magomedov', organisation: 'Bellator' },
  { name: 'Aaron Pico', nickname: '', wins: 12, losses: 4, draws: 0, weightClass: 'Featherweight (bis 66 kg)', gender: 'male', slug: 'aaron-pico', organisation: 'Bellator' },
  { name: 'Impa Kasanganay', nickname: 'Tshilobo', wins: 15, losses: 4, draws: 0, weightClass: 'Light Heavyweight (bis 93 kg)', gender: 'male', slug: 'impa-kasanganay', organisation: 'PFL' },
  { name: 'Magomed Umalatov', nickname: '', wins: 14, losses: 0, draws: 0, weightClass: 'Welterweight (bis 77 kg)', gender: 'male', slug: 'magomed-umalatov', organisation: 'PFL' },
  { name: 'Brendan Loughnane', nickname: '', wins: 28, losses: 5, draws: 0, weightClass: 'Featherweight (bis 66 kg)', gender: 'male', slug: 'brendan-loughnane', organisation: 'PFL' },
  { name: 'Gabriel Braga', nickname: 'Gifted', wins: 13, losses: 2, draws: 0, weightClass: 'Featherweight (bis 66 kg)', gender: 'male', slug: 'gabriel-braga', organisation: 'PFL' },
  { name: 'Dimitry Silvers', nickname: '', wins: 11, losses: 2, draws: 0, weightClass: 'Heavyweight (bis 120 kg)', gender: 'male', slug: 'dimitry-silvers', organisation: 'PFL' },
  { name: 'Renan Ferreira', nickname: 'Problema', wins: 13, losses: 3, draws: 0, weightClass: 'Heavyweight (bis 120 kg)', gender: 'male', slug: 'renan-ferreira', organisation: 'PFL' },
  { name: 'Ante Delija', nickname: 'Walking Trouble', wins: 24, losses: 6, draws: 0, weightClass: 'Heavyweight (bis 120 kg)', gender: 'male', slug: 'ante-delija', organisation: 'PFL' },
  { name: 'Sadibou Sy', nickname: 'The Swedish Denzel', wins: 16, losses: 8, draws: 2, weightClass: 'Welterweight (bis 77 kg)', gender: 'male', slug: 'sadibou-sy', organisation: 'PFL' },
  { name: 'Clay Collard', nickname: 'Cassius', wins: 25, losses: 12, draws: 0, weightClass: 'Lightweight (bis 70 kg)', gender: 'male', slug: 'clay-collard', organisation: 'PFL' },
  { name: 'Bruno Cappelozza', nickname: 'Phenom', wins: 15, losses: 7, draws: 0, weightClass: 'Heavyweight (bis 120 kg)', gender: 'male', slug: 'bruno-cappelozza', organisation: 'PFL' },
  { name: 'AJ McKee', nickname: 'Mercenary', wins: 22, losses: 2, draws: 0, weightClass: 'Featherweight (bis 66 kg)', gender: 'male', slug: 'aj-mckee', organisation: 'Bellator' },
  { name: 'Douglas Lima', nickname: 'The Phenom', wins: 33, losses: 11, draws: 0, weightClass: 'Welterweight (bis 77 kg)', gender: 'male', slug: 'douglas-lima', organisation: 'Bellator' },
  { name: 'Corey Anderson', nickname: 'Overtime', wins: 17, losses: 6, draws: 0, weightClass: 'Light Heavyweight (bis 93 kg)', gender: 'male', slug: 'corey-anderson', organisation: 'Bellator' },
  { name: 'Yoel Romero', nickname: 'Soldier of God', wins: 15, losses: 6, draws: 0, weightClass: 'Light Heavyweight (bis 93 kg)', gender: 'male', slug: 'yoel-romero', organisation: 'Bellator' },
  { name: 'Sergio Pettis', nickname: 'The Phenom', wins: 23, losses: 6, draws: 0, weightClass: 'Bantamweight (bis 61 kg)', gender: 'male', slug: 'sergio-pettis', organisation: 'Bellator' },
  { name: 'Kyoji Horiguchi', nickname: 'The Typhoon', wins: 32, losses: 5, draws: 1, weightClass: 'Bantamweight (bis 61 kg)', gender: 'male', slug: 'kyoji-horiguchi', organisation: 'Bellator' },
  { name: 'Andrey Koreshkov', nickname: 'Spartan', wins: 27, losses: 5, draws: 0, weightClass: 'Welterweight (bis 77 kg)', gender: 'male', slug: 'andrey-koreshkov', organisation: 'Bellator' },
  { name: 'Neiman Gracie', nickname: '', wins: 12, losses: 5, draws: 0, weightClass: 'Welterweight (bis 77 kg)', gender: 'male', slug: 'neiman-gracie', organisation: 'Bellator' },
  { name: 'Adam Borics', nickname: 'The Kid', wins: 19, losses: 3, draws: 0, weightClass: 'Featherweight (bis 66 kg)', gender: 'male', slug: 'adam-borics', organisation: 'Bellator' },
  { name: 'Lorenz Larkin', nickname: 'The Monsoon', wins: 25, losses: 8, draws: 0, weightClass: 'Welterweight (bis 77 kg)', gender: 'male', slug: 'lorenz-larkin', organisation: 'Bellator' },
  { name: 'Dovletdzhan Yagshimuradov', nickname: '', wins: 21, losses: 8, draws: 1, weightClass: 'Middleweight (bis 84 kg)', gender: 'male', slug: 'dovletdzhan-yagshimuradov', organisation: 'Bellator' },
  { name: 'Raymond Daniels', nickname: 'Real Deal', wins: 2, losses: 2, draws: 0, weightClass: 'Welterweight (bis 77 kg)', gender: 'male', slug: 'raymond-daniels', organisation: 'Bellator' },
  { name: 'Larissa Pacheco', nickname: 'Larissa Machine', wins: 23, losses: 5, draws: 0, weightClass: 'Featherweight (bis 66 kg)', gender: 'female', slug: 'larissa-pacheco', organisation: 'PFL' },
  { name: 'Kayla Harrison', nickname: '', wins: 16, losses: 2, draws: 0, weightClass: 'Featherweight (bis 66 kg)', gender: 'female', slug: 'kayla-harrison', organisation: 'PFL' },
  { name: 'Julia Budd', nickname: 'The Jewel', wins: 16, losses: 6, draws: 0, weightClass: 'Featherweight (bis 66 kg)', gender: 'female', slug: 'julia-budd', organisation: 'Bellator' },
  { name: 'Cris Cyborg', nickname: 'Cyborg', wins: 27, losses: 2, draws: 0, weightClass: 'Featherweight (bis 66 kg)', gender: 'female', slug: 'cris-cyborg', organisation: 'Bellator' },
  { name: 'Taila Santos', nickname: '', wins: 19, losses: 3, draws: 0, weightClass: 'Flyweight (bis 57 kg)', gender: 'female', slug: 'taila-santos', organisation: 'PFL' },
  { name: 'Liz Carmouche', nickname: 'Girl-Rilla', wins: 21, losses: 7, draws: 0, weightClass: 'Flyweight (bis 57 kg)', gender: 'female', slug: 'liz-carmouche', organisation: 'Bellator' },
  { name: 'Claressa Shields', nickname: 'T-Rex', wins: 2, losses: 1, draws: 0, weightClass: 'Lightweight (bis 70 kg)', gender: 'female', slug: 'claressa-shields', organisation: 'PFL' },
  { name: 'Shane Burgos', nickname: 'Hurricane', wins: 15, losses: 4, draws: 0, weightClass: 'Featherweight (bis 66 kg)', gender: 'male', slug: 'shane-burgos', organisation: 'PFL' },
  { name: 'Thiago Santos', nickname: 'Marreta', wins: 22, losses: 12, draws: 0, weightClass: 'Light Heavyweight (bis 93 kg)', gender: 'male', slug: 'thiago-santos', organisation: 'PFL' },
  { name: 'Rob Wilkinson', nickname: 'Razor', wins: 17, losses: 2, draws: 0, weightClass: 'Light Heavyweight (bis 93 kg)', gender: 'male', slug: 'rob-wilkinson', organisation: 'PFL' },
  { name: 'Josh Silveira', nickname: '', wins: 12, losses: 2, draws: 0, weightClass: 'Light Heavyweight (bis 93 kg)', gender: 'male', slug: 'josh-silveira', organisation: 'PFL' },
  { name: 'Bubba Jenkins', nickname: 'The Highlight Kid', wins: 21, losses: 8, draws: 0, weightClass: 'Featherweight (bis 66 kg)', gender: 'male', slug: 'bubba-jenkins', organisation: 'PFL' },
  { name: 'Raush Manfio', nickname: '', wins: 18, losses: 6, draws: 0, weightClass: 'Lightweight (bis 70 kg)', gender: 'male', slug: 'raush-manfio', organisation: 'PFL' },
  { name: 'Natan Schulte', nickname: 'Russo', wins: 26, losses: 6, draws: 1, weightClass: 'Lightweight (bis 70 kg)', gender: 'male', slug: 'natan-schulte', organisation: 'PFL' },
  { name: 'Movlid Khaybulaev', nickname: 'Killer', wins: 21, losses: 3, draws: 1, weightClass: 'Featherweight (bis 66 kg)', gender: 'male', slug: 'movlid-khaybulaev', organisation: 'PFL' },
  { name: 'Chris Wade', nickname: 'The Long Island Killer', wins: 23, losses: 10, draws: 0, weightClass: 'Featherweight (bis 66 kg)', gender: 'male', slug: 'chris-wade', organisation: 'PFL' },
  { name: 'Marcin Held', nickname: 'The Polish Prodigy', wins: 28, losses: 9, draws: 0, weightClass: 'Lightweight (bis 70 kg)', gender: 'male', slug: 'marcin-held', organisation: 'PFL' },
  { name: 'Gadzhi Rabadanov', nickname: '', wins: 21, losses: 4, draws: 1, weightClass: 'Lightweight (bis 70 kg)', gender: 'male', slug: 'gadzhi-rabadanov', organisation: 'Bellator' },
  { name: 'Sidney Outlaw', nickname: 'Da Gun', wins: 17, losses: 6, draws: 0, weightClass: 'Lightweight (bis 70 kg)', gender: 'male', slug: 'sidney-outlaw', organisation: 'Bellator' },
  { name: 'Goiti Yamauchi', nickname: '', wins: 28, losses: 6, draws: 0, weightClass: 'Featherweight (bis 66 kg)', gender: 'male', slug: 'goiti-yamauchi', organisation: 'Bellator' },
  { name: 'Dillon Danis', nickname: 'El Jefe', wins: 0, losses: 1, draws: 0, weightClass: 'Middleweight (bis 84 kg)', gender: 'male', slug: 'dillon-danis', organisation: 'Bellator' },
  { name: 'Logan Storley', nickname: 'The Storm', wins: 15, losses: 2, draws: 0, weightClass: 'Welterweight (bis 77 kg)', gender: 'male', slug: 'logan-storley', organisation: 'Bellator' },
  { name: 'Valentin Moldavsky', nickname: 'Badr', wins: 12, losses: 3, draws: 0, weightClass: 'Heavyweight (bis 120 kg)', gender: 'male', slug: 'valentin-moldavsky', organisation: 'Bellator' },
  { name: 'Linton Vassell', nickname: 'The Swarm', wins: 24, losses: 8, draws: 0, weightClass: 'Heavyweight (bis 120 kg)', gender: 'male', slug: 'linton-vassell', organisation: 'Bellator' },
  { name: 'Anatoly Tokov', nickname: '', wins: 32, losses: 4, draws: 0, weightClass: 'Middleweight (bis 84 kg)', gender: 'male', slug: 'anatoly-tokov', organisation: 'Bellator' },
  { name: 'Fabian Edwards', nickname: 'The Assassin', wins: 12, losses: 3, draws: 0, weightClass: 'Middleweight (bis 84 kg)', gender: 'male', slug: 'fabian-edwards', organisation: 'Bellator' },
  { name: 'Costello van Steenis', nickname: 'The Spaniard', wins: 15, losses: 4, draws: 0, weightClass: 'Middleweight (bis 84 kg)', gender: 'male', slug: 'costello-van-steenis', organisation: 'Bellator' },

  // ========== Oktagon MMA (~40) ==========
  { name: 'Patrik Kincl', nickname: 'The Inspector', wins: 26, losses: 12, draws: 0, weightClass: 'Middleweight (bis 84 kg)', gender: 'male', slug: 'patrik-kincl', organisation: 'Oktagon MMA' },
  { name: 'Losene Keita', nickname: 'Black Panther', wins: 14, losses: 2, draws: 0, weightClass: 'Featherweight (bis 66 kg)', gender: 'male', slug: 'losene-keita', organisation: 'Oktagon MMA' },
  { name: 'Ivan Buchinger', nickname: 'The Terrible', wins: 40, losses: 8, draws: 0, weightClass: 'Lightweight (bis 70 kg)', gender: 'male', slug: 'ivan-buchinger', organisation: 'Oktagon MMA' },
  { name: 'Mateusz Legierski', nickname: 'Legia', wins: 11, losses: 2, draws: 0, weightClass: 'Welterweight (bis 77 kg)', gender: 'male', slug: 'mateusz-legierski', organisation: 'Oktagon MMA' },
  { name: 'Jakub Tichota', nickname: '', wins: 8, losses: 2, draws: 0, weightClass: 'Welterweight (bis 77 kg)', gender: 'male', slug: 'jakub-tichota', organisation: 'Oktagon MMA' },
  { name: 'Vlasto Cepo', nickname: '', wins: 15, losses: 12, draws: 1, weightClass: 'Middleweight (bis 84 kg)', gender: 'male', slug: 'vlasto-cepo', organisation: 'Oktagon MMA' },
  { name: 'Andre Fialho', nickname: '', wins: 16, losses: 8, draws: 0, weightClass: 'Welterweight (bis 77 kg)', gender: 'male', slug: 'andre-fialho', organisation: 'Oktagon MMA' },
  { name: 'Akop Szostak', nickname: '', wins: 11, losses: 6, draws: 0, weightClass: 'Middleweight (bis 84 kg)', gender: 'male', slug: 'akop-szostak', organisation: 'Oktagon MMA' },
  { name: 'Matous Kohout', nickname: '', wins: 10, losses: 6, draws: 0, weightClass: 'Light Heavyweight (bis 93 kg)', gender: 'male', slug: 'matous-kohout', organisation: 'Oktagon MMA' },
  { name: 'Pavel Kucera', nickname: '', wins: 8, losses: 4, draws: 0, weightClass: 'Heavyweight (bis 120 kg)', gender: 'male', slug: 'pavel-kucera', organisation: 'Oktagon MMA' },
  { name: 'Ronald Paradeiser', nickname: '', wins: 17, losses: 8, draws: 0, weightClass: 'Lightweight (bis 70 kg)', gender: 'male', slug: 'ronald-paradeiser', organisation: 'Oktagon MMA' },
  { name: 'Salahdine Parnasse', nickname: '', wins: 18, losses: 2, draws: 1, weightClass: 'Featherweight (bis 66 kg)', gender: 'male', slug: 'salahdine-parnasse-oktagon', organisation: 'Oktagon MMA' },
  { name: 'David Kozma', nickname: 'Pink Panther', wins: 31, losses: 14, draws: 0, weightClass: 'Welterweight (bis 77 kg)', gender: 'male', slug: 'david-kozma', organisation: 'Oktagon MMA' },
  { name: 'Marek Mazuch', nickname: '', wins: 8, losses: 4, draws: 0, weightClass: 'Light Heavyweight (bis 93 kg)', gender: 'male', slug: 'marek-mazuch', organisation: 'Oktagon MMA' },
  { name: 'Lukas Bukovaz', nickname: '', wins: 6, losses: 2, draws: 0, weightClass: 'Middleweight (bis 84 kg)', gender: 'male', slug: 'lukas-bukovaz', organisation: 'Oktagon MMA' },
  { name: 'Jan Siroky', nickname: '', wins: 9, losses: 5, draws: 0, weightClass: 'Welterweight (bis 77 kg)', gender: 'male', slug: 'jan-siroky', organisation: 'Oktagon MMA' },
  { name: 'Marek Bartl', nickname: '', wins: 12, losses: 8, draws: 0, weightClass: 'Lightweight (bis 70 kg)', gender: 'male', slug: 'marek-bartl', organisation: 'Oktagon MMA' },
  { name: 'Karol Rysavy', nickname: '', wins: 11, losses: 6, draws: 0, weightClass: 'Featherweight (bis 66 kg)', gender: 'male', slug: 'karol-rysavy', organisation: 'Oktagon MMA' },
  { name: 'Milos Petrasek', nickname: '', wins: 12, losses: 9, draws: 0, weightClass: 'Light Heavyweight (bis 93 kg)', gender: 'male', slug: 'milos-petrasek', organisation: 'Oktagon MMA' },
  { name: 'Michal Kotalik', nickname: '', wins: 9, losses: 4, draws: 0, weightClass: 'Middleweight (bis 84 kg)', gender: 'male', slug: 'michal-kotalik', organisation: 'Oktagon MMA' },
  { name: 'Vaclav Mikulasek', nickname: '', wins: 14, losses: 7, draws: 0, weightClass: 'Welterweight (bis 77 kg)', gender: 'male', slug: 'vaclav-mikulasek', organisation: 'Oktagon MMA' },
  { name: 'Robert Pukac', nickname: '', wins: 10, losses: 5, draws: 0, weightClass: 'Lightweight (bis 70 kg)', gender: 'male', slug: 'robert-pukac', organisation: 'Oktagon MMA' },
  { name: 'Dominik Herber', nickname: '', wins: 7, losses: 3, draws: 0, weightClass: 'Bantamweight (bis 61 kg)', gender: 'male', slug: 'dominik-herber', organisation: 'Oktagon MMA' },
  { name: 'Jonas Magard', nickname: '', wins: 14, losses: 6, draws: 0, weightClass: 'Bantamweight (bis 61 kg)', gender: 'male', slug: 'jonas-magard', organisation: 'Oktagon MMA' },
  { name: 'Frantisek Fodor', nickname: '', wins: 11, losses: 8, draws: 0, weightClass: 'Featherweight (bis 66 kg)', gender: 'male', slug: 'frantisek-fodor', organisation: 'Oktagon MMA' },
  { name: 'Mateusz Strzelczyk', nickname: '', wins: 8, losses: 4, draws: 0, weightClass: 'Lightweight (bis 70 kg)', gender: 'male', slug: 'mateusz-strzelczyk', organisation: 'Oktagon MMA' },
  { name: 'Leo Brichta', nickname: '', wins: 12, losses: 5, draws: 0, weightClass: 'Welterweight (bis 77 kg)', gender: 'male', slug: 'leo-brichta', organisation: 'Oktagon MMA' },
  { name: 'Petr Knize', nickname: '', wins: 15, losses: 10, draws: 0, weightClass: 'Middleweight (bis 84 kg)', gender: 'male', slug: 'petr-knize', organisation: 'Oktagon MMA' },
  { name: 'Stefan Sekulic', nickname: '', wins: 13, losses: 6, draws: 0, weightClass: 'Light Heavyweight (bis 93 kg)', gender: 'male', slug: 'stefan-sekulic', organisation: 'Oktagon MMA' },
  { name: 'Martin Hudson', nickname: '', wins: 9, losses: 4, draws: 0, weightClass: 'Heavyweight (bis 120 kg)', gender: 'male', slug: 'martin-hudson', organisation: 'Oktagon MMA' },
  { name: 'Denis Tripsansky', nickname: '', wins: 10, losses: 5, draws: 0, weightClass: 'Welterweight (bis 77 kg)', gender: 'male', slug: 'denis-tripsansky', organisation: 'Oktagon MMA' },
  { name: 'Ondrej Raška', nickname: '', wins: 8, losses: 3, draws: 0, weightClass: 'Middleweight (bis 84 kg)', gender: 'male', slug: 'ondrej-raska', organisation: 'Oktagon MMA' },
  { name: 'Jaroslav Pokorny', nickname: '', wins: 11, losses: 7, draws: 0, weightClass: 'Lightweight (bis 70 kg)', gender: 'male', slug: 'jaroslav-pokorny', organisation: 'Oktagon MMA' },
  { name: 'Tomas Cibere', nickname: '', wins: 7, losses: 4, draws: 0, weightClass: 'Featherweight (bis 66 kg)', gender: 'male', slug: 'tomas-cibere', organisation: 'Oktagon MMA' },
  { name: 'Daniel Skvor', nickname: '', wins: 14, losses: 9, draws: 0, weightClass: 'Welterweight (bis 77 kg)', gender: 'male', slug: 'daniel-skvor', organisation: 'Oktagon MMA' },
  { name: 'Marek Samociuk', nickname: '', wins: 6, losses: 2, draws: 0, weightClass: 'Bantamweight (bis 61 kg)', gender: 'male', slug: 'marek-samociuk', organisation: 'Oktagon MMA' },
  { name: 'Vojtech Garba', nickname: '', wins: 9, losses: 5, draws: 0, weightClass: 'Light Heavyweight (bis 93 kg)', gender: 'male', slug: 'vojtech-garba', organisation: 'Oktagon MMA' },
  { name: 'Petr Benak', nickname: '', wins: 12, losses: 6, draws: 0, weightClass: 'Middleweight (bis 84 kg)', gender: 'male', slug: 'petr-benak', organisation: 'Oktagon MMA' },
  { name: 'Martin Zawada', nickname: '', wins: 8, losses: 4, draws: 0, weightClass: 'Heavyweight (bis 120 kg)', gender: 'male', slug: 'martin-zawada', organisation: 'Oktagon MMA' },
  { name: 'Eva Dvorakova', nickname: '', wins: 5, losses: 2, draws: 0, weightClass: 'Strawweight (bis 52 kg)', gender: 'female', slug: 'eva-dvorakova', organisation: 'Oktagon MMA' },
  { name: 'Lucie Pudilova', nickname: 'Boss', wins: 14, losses: 9, draws: 0, weightClass: 'Bantamweight (bis 61 kg)', gender: 'female', slug: 'lucie-pudilova', organisation: 'Oktagon MMA' },

  // ========== KSW (~30) ==========
  { name: 'Salahdine Parnasse', nickname: 'The Eagle', wins: 18, losses: 2, draws: 1, weightClass: 'Featherweight (bis 66 kg)', gender: 'male', slug: 'salahdine-parnasse', organisation: 'KSW' },
  { name: 'Mamed Khalidov', nickname: 'Cannibal', wins: 36, losses: 8, draws: 2, weightClass: 'Middleweight (bis 84 kg)', gender: 'male', slug: 'mamed-khalidov', organisation: 'KSW' },
  { name: 'Phil De Fries', nickname: 'Cabbage', wins: 24, losses: 6, draws: 0, weightClass: 'Heavyweight (bis 120 kg)', gender: 'male', slug: 'phil-de-fries', organisation: 'KSW' },
  { name: 'Mariusz Pudzianowski', nickname: 'Pudzian', wins: 21, losses: 8, draws: 0, weightClass: 'Heavyweight (bis 120 kg)', gender: 'male', slug: 'mariusz-pudzianowski', organisation: 'KSW' },
  { name: 'Roberto Soldic', nickname: 'Robocop', wins: 21, losses: 6, draws: 0, weightClass: 'Welterweight (bis 77 kg)', gender: 'male', slug: 'roberto-soldic', organisation: 'KSW' },
  { name: 'Tomasz Narkun', nickname: 'Giraffe', wins: 19, losses: 6, draws: 0, weightClass: 'Light Heavyweight (bis 93 kg)', gender: 'male', slug: 'tomasz-narkun', organisation: 'KSW' },
  { name: 'Sebastian Przybysz', nickname: '', wins: 11, losses: 4, draws: 0, weightClass: 'Featherweight (bis 66 kg)', gender: 'male', slug: 'sebastian-przybysz', organisation: 'KSW' },
  { name: 'Daniel Torres', nickname: 'Agent', wins: 12, losses: 5, draws: 0, weightClass: 'Bantamweight (bis 61 kg)', gender: 'male', slug: 'daniel-torres', organisation: 'KSW' },
  { name: 'Pawel Pawlak', nickname: 'Plastinho', wins: 22, losses: 5, draws: 1, weightClass: 'Welterweight (bis 77 kg)', gender: 'male', slug: 'pawel-pawlak', organisation: 'KSW' },
  { name: 'Ivan Erslan', nickname: '', wins: 13, losses: 3, draws: 0, weightClass: 'Light Heavyweight (bis 93 kg)', gender: 'male', slug: 'ivan-erslan', organisation: 'KSW' },
  { name: 'Michal Materla', nickname: 'Cipao', wins: 32, losses: 9, draws: 0, weightClass: 'Middleweight (bis 84 kg)', gender: 'male', slug: 'michal-materla', organisation: 'KSW' },
  { name: 'Antun Racic', nickname: 'Killer', wins: 26, losses: 10, draws: 2, weightClass: 'Bantamweight (bis 61 kg)', gender: 'male', slug: 'antun-racic', organisation: 'KSW' },
  { name: 'Marcin Wrzosek', nickname: 'Polish Zombie', wins: 15, losses: 6, draws: 0, weightClass: 'Featherweight (bis 66 kg)', gender: 'male', slug: 'marcin-wrzosek', organisation: 'KSW' },
  { name: 'Borys Mankowski', nickname: 'Tas', wins: 22, losses: 9, draws: 0, weightClass: 'Welterweight (bis 77 kg)', gender: 'male', slug: 'borys-mankowski', organisation: 'KSW' },
  { name: 'Norman Parke', nickname: 'Stormin', wins: 30, losses: 8, draws: 1, weightClass: 'Lightweight (bis 70 kg)', gender: 'male', slug: 'norman-parke', organisation: 'KSW' },
  { name: 'Damian Janikowski', nickname: 'Polish Pitbull', wins: 5, losses: 5, draws: 0, weightClass: 'Middleweight (bis 84 kg)', gender: 'male', slug: 'damian-janikowski', organisation: 'KSW' },
  { name: 'Lukasz Rajewski', nickname: '', wins: 12, losses: 8, draws: 0, weightClass: 'Bantamweight (bis 61 kg)', gender: 'male', slug: 'lukasz-rajewski', organisation: 'KSW' },
  { name: 'Artur Sowinski', nickname: 'The Lion', wins: 24, losses: 14, draws: 0, weightClass: 'Flyweight (bis 57 kg)', gender: 'male', slug: 'artur-sowinski', organisation: 'KSW' },
  { name: 'Kamil Selwa', nickname: '', wins: 10, losses: 5, draws: 0, weightClass: 'Light Heavyweight (bis 93 kg)', gender: 'male', slug: 'kamil-selwa', organisation: 'KSW' },
  { name: 'Rafal Haratyk', nickname: '', wins: 19, losses: 5, draws: 1, weightClass: 'Middleweight (bis 84 kg)', gender: 'male', slug: 'rafal-haratyk', organisation: 'KSW' },
  { name: 'Cezary Kesik', nickname: '', wins: 13, losses: 4, draws: 0, weightClass: 'Welterweight (bis 77 kg)', gender: 'male', slug: 'cezary-kesik', organisation: 'KSW' },
  { name: 'Maciej Kazieczko', nickname: '', wins: 9, losses: 3, draws: 0, weightClass: 'Lightweight (bis 70 kg)', gender: 'male', slug: 'maciej-kazieczko', organisation: 'KSW' },
  { name: 'Pawel Jozwa', nickname: '', wins: 11, losses: 6, draws: 0, weightClass: 'Featherweight (bis 66 kg)', gender: 'male', slug: 'pawel-jozwa', organisation: 'KSW' },
  { name: 'Krystian Bielski', nickname: '', wins: 10, losses: 4, draws: 0, weightClass: 'Middleweight (bis 84 kg)', gender: 'male', slug: 'krystian-bielski', organisation: 'KSW' },
  { name: 'Albert Odzimkowski', nickname: '', wins: 12, losses: 5, draws: 0, weightClass: 'Welterweight (bis 77 kg)', gender: 'male', slug: 'albert-odzimkowski', organisation: 'KSW' },
  { name: 'Marcin Różalski', nickname: 'Bomba', wins: 8, losses: 8, draws: 0, weightClass: 'Heavyweight (bis 120 kg)', gender: 'male', slug: 'marcin-rozalski', organisation: 'KSW' },
  { name: 'Martin Zawada', nickname: 'Zawadka', wins: 8, losses: 4, draws: 0, weightClass: 'Heavyweight (bis 120 kg)', gender: 'male', slug: 'martin-zawada-ksw', organisation: 'KSW' },
  { name: 'Pawel Politylo', nickname: '', wins: 6, losses: 3, draws: 0, weightClass: 'Light Heavyweight (bis 93 kg)', gender: 'male', slug: 'pawel-politylo', organisation: 'KSW' },
  { name: 'Dominik Humburger', nickname: '', wins: 7, losses: 2, draws: 0, weightClass: 'Middleweight (bis 84 kg)', gender: 'male', slug: 'dominik-humburger', organisation: 'KSW' },
  { name: 'Adrian Bartosinski', nickname: '', wins: 14, losses: 2, draws: 0, weightClass: 'Welterweight (bis 77 kg)', gender: 'male', slug: 'adrian-bartosinski', organisation: 'KSW' },
  { name: 'Anastasia Feofilaktova', nickname: '', wins: 4, losses: 2, draws: 0, weightClass: 'Flyweight (bis 57 kg)', gender: 'female', slug: 'anastasia-feofilaktova', organisation: 'KSW' },
  { name: 'Karolina Owczarz', nickname: '', wins: 5, losses: 3, draws: 0, weightClass: 'Strawweight (bis 52 kg)', gender: 'female', slug: 'karolina-owczarz', organisation: 'KSW' },
]

function ensureEnv(): void {
  if (process.env.PAYLOAD_SECRET?.trim()) return
  try {
    const envPath = path.resolve(process.cwd(), '.env')
    const content = fs.readFileSync(envPath, 'utf8')
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.replace(/^#.*/, '').trim()
      const match = trimmed.match(/^([A-Z_]+)=(.+)$/)
      if (match) {
        const [, key, val] = match
        const value = val.trim().replace(/^["']|["']$/g, '')
        if (key && value) process.env[key] = value
      }
    }
  } catch {
    // ignore
  }
}

async function run(): Promise<void> {
  ensureEnv()

  if (!process.env.PAYLOAD_SECRET?.trim()) {
    const envPath = path.join(root, '.env')
    console.error('FEHLER: PAYLOAD_SECRET ist nicht gesetzt.')
    console.error(`  Geladene .env: ${envPath}`)
    console.error('  Prüfe, ob PAYLOAD_SECRET=... in .env steht und einen nicht-leeren Wert hat.')
    process.exit(1)
  }

  // Config als Modul laden (nicht als Pfad), damit process.env bereits gesetzt ist
  const configPath = path.resolve(root, 'src', 'payload.config.ts')
  const configModule = await import(pathToFileURL(configPath).href)
  const config = configModule.default
  const payload = await getPayload({ config })

  console.log(`Starte Import von ${FIGHTERS.length} Kämpfern...\n`)

  let imported = 0
  let skipped = 0

  for (const fighter of FIGHTERS) {
    try {
      const physical =
        PHYSICAL_STATS[fighter.slug] ?? getDefaultPhysical(fighter.weightClass, fighter.gender)

      const stats: Record<string, string> = {}
      if (physical.height?.trim()) stats.height = physical.height.trim()
      if (physical.reach?.trim()) stats.reach = physical.reach.trim()
      if (physical.legReach?.trim()) stats.legReach = physical.legReach.trim()

      await payload.create({
        collection: 'fighters',
        data: {
          name: fighter.name,
          slug: fighter.slug,
          nickname: fighter.nickname || undefined,
          wins: fighter.wins,
          losses: fighter.losses,
          draws: fighter.draws,
          weightClass: fighter.weightClass,
          gender: fighter.gender,
          dateOfBirth: physical.dateOfBirth?.trim() || undefined,
          stats: Object.keys(stats).length > 0 ? stats : undefined,
        },
      })
      imported++
      console.log(`Importiert: ${fighter.name} (${fighter.organisation})`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.includes('duplicate') || msg.includes('unique') || msg.includes('already exists') || msg.includes('slug')) {
        skipped++
        console.log(`Übersprungen (bereits vorhanden): ${fighter.name} (${fighter.organisation})`)
      } else {
        console.error(`Fehler bei ${fighter.name}:`, msg)
      }
    }
  }

  console.log(`\nFertig. Importiert: ${imported}, übersprungen: ${skipped}`)
  process.exit(0)
}

run().catch((err) => {
  console.error('Unerwarteter Fehler:', err)
  process.exit(1)
})
