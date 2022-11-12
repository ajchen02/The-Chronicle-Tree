// Sloth, a.k.a Impatience

addLayer("s", {
    name: "Sloth", // This is optional, only used in a few places, If absent it just uses the layer id.
    disp_symbol: "ＳＬＨ",
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 4, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: d(0),
        sloth: d(0),
        limit: d(120),
        speed: d(1)
    }},
    color: "#f1c40f",
    subcolor: "#ffeaa7",
    requires: d(1), // Can be a function that takes requirement increases into account
    resource: "重生点", // Name of prestige currency
    baseResource: "重生分数", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = d(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return d(1)
    },
    tooltip:() => "Sloth: " + format(player.s.sloth),
    tooltipLocked:() => "Sloth: " + format(player.s.sloth),
    prestigeNotify: () => false,
    
    buyables: {
        11: {
            title: "Feel Sloth",
            cost(x) { return d(2).pow(x).mul(120) },
            display() { 
                let cur_amount = getBuyableAmount(this.layer, this.id)
                return `Max Sloth x2\n
                Currently: ${format(player.s.limit)}
                Next cost: ${format(this.cost(cur_amount))}` 
            },
            canAfford() { return player[this.layer].sloth.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].sloth = player[this.layer].sloth.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                return d(2).pow(cur_amount).mul(120)
            }
        },
        12: {
            title: "Feel time passing",
            cost(x) { return d(3).pow(x).mul(40) },
            display() { 
                let cur_amount = getBuyableAmount(this.layer, this.id)
                return `Global time speed x1.1 \n
                Currently: ${format(this.effect(cur_amount))}x
                Next cost: ${format(this.cost(cur_amount))}` 
            },
            canAfford() { 
                return player[this.layer].sloth.gte(this.cost(getBuyableAmount(this.layer, this.id))) 
            },
            buy() {
                player[this.layer].sloth = player[this.layer].sloth.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                return d(1.1).pow(cur_amount)
            }
        },
        13: {
            title: "More Sloth",
            cost(x) { return d(2.5).pow(x).mul(80) },
            display() { 
                let cur_amount = getBuyableAmount(this.layer, this.id)
                return `Sloth gain x1.5 \n
                Currently: ${format(this.effect(cur_amount))}x
                Next cost: ${format(this.cost(cur_amount))}` 
            },
            canAfford() { return player[this.layer].sloth.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].sloth = player[this.layer].sloth.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                return d(1.5).pow(cur_amount)
            }
        }
    },

    row: "side", // Row the layer is in on the tree (0 is the first row)

    layerShown: () => hasAchievement("m", 15),
    unlocked: () => hasAchievement("m", 15),

    shouldNotify: () => {
        for (let id of [11, 12, 13]) {
            if (tmp.s.buyables[id].canAfford) return true
        }
        return player.s.sloth.gte(player.s.limit)
    },

    tabFormat: ["blank",
        ["display-text", function() {
        return `You have <span style='color:#f1c40f; font-size:25px'>${format(player.s.sloth, 0)}</span> / ${format(player.s.limit)} Sloth (${format(player.s.speed)}/s)`
     }, {"font-size": "20px"}],
        "blank",
        "buyables"],

    update(diff) {
        let s = player.s
        s.speed = buyableEffect(this.layer, 13)
        s.limit = buyableEffect(this.layer, 11)

        let sl = s.speed.mul(diff).mul(buyableEffect(this.layer, 12))
        s.sloth = s.sloth.add(sl).min(s.limit)
    }
})
