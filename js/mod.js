let modInfo = {
	name: "The Chronicle Tree",
	id: "chronicle",
	author: "catfish",
	pointsName: "Free time",
	modFiles: [
		"utils/funcutils.js",
		"tree.js", 
		// Area layers
		"areas/seaofgoogol.js", 
		"areas/peanothevillage.js", 
		"areas/theplainofsquares.js",
		"areas/everfortoftheeternity.js",
		"areas/mounttrillion.js",
		// System layers
		"item.js", 
		"making.js",
		"ritual.js", 
		"memory.js", 
		"experience.js", 
		"sloth.js", 
		"battle.js",
		"limitation.js",
		// Resource files
		"texts/dialogue.js",
		"texts/bufftable.js",
		"texts/equiptable.js",
		"texts/enemytable.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 0,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.02",
	name: "第一点五步",
}

let changelog = `<h1>Changelog:</h1><br>
	<h2><del>FOR GOD SAKE I WILL NOT TRANSLATE THIS</del></h2><br>
	<br><br>

	<h3>v0.02+ End of Novice Area </h3><br>
		- More mechanics, materials and a battle zone, the end of 2nd area layer.<br>
		<br>
	<h3>v0.02 Step 1.5</h3><br>
		- Added half of area layer, rebalanced game.<br>
		- Might be a bit slow at start.<br>
		<br>
	<h3>v0.01+ Step 1</h3><br>
		- Added half of area layer, rewrite most mechanics, the introduction to Number<br>
		- Might be somehow imbalanced.<br>
		<br>
	<h3>v0.01 Start of the Journey</h3><br>
		- Added 5 system layers + 2 area layers, implemented the first zone and the basic intro<br>
		- Non-balanced.<br>
		`

let intro = `<h1>Intro:</h1><br>
		Sources of inspiration of this tree including Increlution, Your Chronicle, NGU Idle and more.<br>
		Based on Incremental / Idle game, Try to tell a story of number inflating RPG.<br>
	`

let winText = `You have beated all the current context! Thanks for your playing, Stay turned for updates~`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything", "youDied", "addRawScore", "addInventory", "discardInventory", "forgeEquipment", "removeEquip",
	"startEncounter", "startZone", "pushBattleLog", "addBattleExp", "prevBattleBuff", "OTBuffs", "attack", "subBuffMoves", "applyEquipmentBuffs", "possibleEffect",
	"buffText", "traitsText", "equipDisplay", "extraExpEffect", "getExtraExpEffect", "survivalSkillExpMult", "addRawExpSurvival", "extraExpDisplay", "addSigil0Score"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return (!player.r.is_dead) && (!player.b.in_battle)
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	gain = gain.mul(buyableEffect("s", 12))

	gain = gain.mul(tmp.r.speedUp)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	function() {
		return `Current Endgame: Unlock <i>specific</i> location`
	},

	function() {
		if (player.r.is_dead) {
			return `<p>${player.r.last_death_cause}</p><p>YOU DEAD! You can't do anything until you reborn.</p>`
		}

	},

	function() {
		if (hasAchievement("m", 14)) {
			return `Your current number is ${format(tmp.r.number)}`
		}
	}
]

// Determines when the game "ends"
function isEndgame() {
	return player.m.mp_layer_clear
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}