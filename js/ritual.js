// Ritual, a.k.a Reincarnation, Rebirth, Abdicate, Prestige...

var skill2id = {"swimming": 11, "communication": 12, "laboring": 13, "cooking": 21, "trading": 22, "fishing": 23, "hunting": 31}

var id2skill = {11: "swimming", 12: "communication", 13: "laboring", 21: "cooking", 22: "trading", 23: "fishing", 31: "hunting"}

let ritual_buyable_style = {
    "width": "200px",
    "height": "120px",
    "margin-top": "10px",
    "border-radius": "0px",
    "border": "1px",
    "border-color": "rgba(0, 0, 0, 0.125)"
}

let sigil_template = (symbol) => {
    return `<p class='sigilSymbol'>${symbol}</p>`
}

addLayer("r", {
    name: "reborn", // This is optional, only used in a few places, If absent it just uses the layer id.
    disp_symbol: "Reborn",
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
        points: d(0),
        score: d(0),
        sigil0_pool: d(0),
        sigil0_score: d(0),
        deaths: d(0),
        is_dead: false
    }},
    color: "#3498db",
    subcolor: "#74b9ff",
    requires: d(1), // Can be a function that takes requirement increases into account
    resource: "Reborn point", // Name of prestige currency
    baseResource: "Reborn score", // Name of resource prestige is based on
    baseAmount() {return player.r.score.add(1)}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.75, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = d(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return d(1)
    },
    scoreGainMult() {
        let mult = d(10)
        return mult
    },
    scoreGainExp() {
        let score_exp = d(1)
        return score_exp
    },
    number() {
        let n = d(1).mul(tmp.r.sigil0Effect)
        return n
    },


    // effect 0: add extra levels to skill;
    // effect 1: multiplies skill exp gain
    extraExpEffect(id) {
        let cur_amount = getBuyableAmount("r", id)
        let mult_gain = cur_amount.add(1).log(5).add(1)
        return [cur_amount, mult_gain]
    },

    // get effect by skill name
    getExtraExpEffect(skill) {
        return layers.r.extraExpEffect(skill2id[skill])
    },

    extraExpDisplay(id, cost) {
        let skill = id2skill[id]
        let effect = buyableEffect("r", id)
        return `${skill_dispn[skill]} bonus level +${format(effect[0], 0)},
        Multiply ${skill_dispn[skill]} experience by x${format(effect[1])}

        Next level cost: ${format(cost)} Reborn points`
    },

    upgrades: {
        11: {
            title: "Automatic - Peano village",
            description: "In Peano village, gain 0.5 spent time every second. (Infected by Indolent and global speed)",
            unlocked: () => hasAchievement("m", 22),
            cost: d(100),
        },

        12: {
            title: "Sequence Breaking I",
            description: "<i>Why do I MUST buying a weapon?</i><br>When not equip any weapon, You use your Fist (Number 1, ATK 3). And now you unlock The plain of squares without Upgrade-Set sail from Peano village.",
            unlocked: () => hasUpgrade("r", 11),
            cost: d(300),
        },
        
        13: {
            title: "Simplelize I",
            description: "Automaticly spend time in Peano village's tavern and farmhouse.",
            unlocked: () => hasUpgrade("r", 12),
            cost: d(2000),
        },
    },

    buyables: {
        11: {
            title: "Swimming",
            cost(x) { return d(1).mul(x.add(1).pow(2)) },
            display() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                return layers.r.extraExpDisplay(this.id, this.cost(cur_amount))
            },
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() { return layers.r.extraExpEffect(this.id) },
            style: ritual_buyable_style
        },
        
        12: {
            title: "Communicating", 
            cost(x) { return d(1).mul(x.add(1).pow(2)) },
            display() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                return layers.r.extraExpDisplay(this.id, this.cost(cur_amount))
            },
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() { return layers.r.extraExpEffect(this.id) },
            unlocked: () => hasAchievement("m", 12), 
            style: ritual_buyable_style
        },
        
        13: {
            title: "Laboring",
            cost(x) { return d(1).mul(x.add(1).pow(2)) },
            display() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                return layers.r.extraExpDisplay(this.id, this.cost(cur_amount))
            },
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() { return layers.r.extraExpEffect(this.id) },
            unlocked: () => hasAchievement("m", 12), 
            style: ritual_buyable_style
        },
        
        21: {
            title: "Cooking",
            cost(x) { return d(1).mul(x.add(1).pow(2)) },
            display() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                return layers.r.extraExpDisplay(this.id, this.cost(cur_amount))
            },
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() { return layers.r.extraExpEffect(this.id) },
            unlocked: () => hasAchievement("m", 12), 
            style: ritual_buyable_style
        },

        22: {
            title: "Trading",
            cost(x) { return d(1).mul(x.add(1).pow(2)) },
            display() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                return layers.r.extraExpDisplay(this.id, this.cost(cur_amount))
            },
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() { return layers.r.extraExpEffect(this.id) },
            unlocked: () => hasAchievement("m", 12), 
            style: ritual_buyable_style
        },

        23: {
            title: "Fishing",
            cost(x) { return d(1).mul(x.add(1).pow(2)) },
            display() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                return layers.r.extraExpDisplay(this.id, this.cost(cur_amount))
            },
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() { return layers.r.extraExpEffect(this.id) },
            unlocked: () => hasAchievement("m", 12), 
            style: ritual_buyable_style
        },
        
        31: {
            title: "Hunting",
            cost(x) { return d(1).mul(x.add(1).pow(2)) },
            display() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                return layers.r.extraExpDisplay(this.id, this.cost(cur_amount))
            },
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() { return layers.r.extraExpEffect(this.id) },
            unlocked: () => hasAchievement("m", 12), 
            style: ritual_buyable_style
        },
    },


    infoboxes: {
        lore: {
            title: "Story",
            body() { return "\tYour eyes closed in dark at the very moment of your death, and your conscious slowly fade out. Every sense leaves you away, as if you are on the border between reality and dream. \nYou soon realized that you are not died in reality." }
        },
        systemintro: {
            title: "数字",
            body() {
                return `
                    <p style='font-size:20px'>数字是世界的核心系统。</p>
                    <br>
                    数字直接影响你作为一个生物的物理尺寸，也即长宽高的倍率。<br>
                    你的质量和数字的立方成正比，使战斗中的HP, ATK, DEF全部等比例提升。<br>
                    你的一些行动消耗也会相应上升。<br>
                    最后，你的时间速度受到数字的立方根加成。包括战斗时的行动速度。<br>
                    不过别忘了，这一切对你的敌人同样适用。小心高数字的敌人！<br>
                    <br>

                    <p style='font-size:20px'>装备中的数字</p>
                    <br>
                    武器装备也拥有各自的数字，代表其各自的尺寸。<br>
                    你在战斗中的攻防数字，可以看作你与装备两者数字的几何平均。<br>
                    <br>
                    实际HP = 基础HP * 角色数字<sup>3</sup><br>
                    实际ATK = 武器基础ATK * (武器数字 * 角色数字)<sup>1.5</sup><br>
                    实际DEF = 盾牌DEF + 护甲DEF<br>
                    盾牌DEF = 盾牌基础DEF * (盾牌数字 * 角色数字)<sup>1.5</sup><br>
                    护甲DEF = 护甲基础DEF * (护甲数字 * 角色数字)<sup>1.5</sup><br>
                    <br>
                    戒指虽不提供战斗数值，但其特殊效果受到自身数字影响。<br>
                    <br>
                    生产工具的数字，同样直接提升相关行动的产出。<br>
                    <br>
                    生产工具产出 = 基础产出 * 技能加成 * (工具数字 * 角色数字)<sup>1.5</sup><br>
                `
            }
        }
    },
    youDied(death_cause) {
        console.log("you died")
        player.r.is_dead = true
        player.r.last_death_cause = death_cause
        player.r.deaths = player.r.deaths.add(1)
    },
    addRawScore(score) {
        score = score.pow(tmp.r.scoreGainExp)
        score = score.mul(tmp.r.scoreGainMult)
        player.r.score = player.r.score.add(score)
    },
    addSigil0Score(score) {
        player.r.sigil0_score = player.r.sigil0_score.add(score)
    },

    row: 10, // Row the layer is in on the tree (0 is the first row)
    displayRow: "side",
    hotkeys: [
        {key: "r", description: "r: Reborn", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    doReset(resettingLayer) {
        if (resettingLayer == "r") {
            player.r.is_dead = false
            player.r.last_death_cause = ""
            player.r.score = d(0)

            if (player.m.sigil0_unlocked) {
                player.r.sigil0_pool = player.r.sigil0_pool.add(player.r.sigil0_score)
            }
            player.r.sigil0_score = d(0)
        }
    },
    layerShown() {
        return player.r.deaths.gte(1)
    },
    physicalEffect() {
        return tmp.r.number
    },
    consumptionEffect() {
        return tmp.r.number.pow(3)
    },
    speedUp() {
        return tmp.r.number.cbrt()
    },
    

    sigil0Effect() {
        if (!player.m.sigil0_unlocked) return d(1)
        return player.r.sigil0_pool.div(400).add(3).log(3).max(1)
    },

    sigil0EffectNext() {
        if (!player.m.sigil0_unlocked) return d(1)
        let next_sigil0_pool = player.r.sigil0_pool.add(player.r.sigil0_score)
        return next_sigil0_pool.div(400).add(3).log(3)
    },

    tabFormat: {
        "Skill": {
            content: ["main-display",
                "prestige-button", "resource-display",
                "blank",
                ["infobox", "lore"],
                "blank",
                "upgrades",
                "blank",
                "buyables"]
        },

        "Number": {
            content: [["display-text", function(){
                let ret = `<p style='font-size: 20px; margin-bottom: 20px'>你目前的数字为 ${format(tmp.r.number)}</p>`

                ret += `<p>你的物理尺寸提升 x${format(tmp.r.physicalEffect)}</p>`
                ret += `<p>你的资源消耗提升 x${format(tmp.r.consumptionEffect)}</p>`
                ret += `<p>你的时间速度提升 x${format(tmp.r.speedUp)}</p>`

                return ret
            }],
            "blank",
            ["row", [["display-text", function() {
                if (!player.m.sigil0_unlocked) return
                let ret = sigil_template("0")
                return ret
            }], ["display-text", function() {
                if (!player.m.sigil0_unlocked) return
                let ret = `角质构成的椭圆形符号，带有浅浅的麝香味。<br>
                    根据所获战斗经验总量得到成长，提升下一次重生的数字。<br>
                    目前效果: x${format(tmp.r.sigil0Effect)} 重生后: x${format(tmp.r.sigil0EffectNext)}`
                return ret
            }]]],
            "blank",
            ["infobox", "systemintro"]],
            unlocked() {
                return hasAchievement("m", 14)
            }
        }

    },

    canReset() {
        return player.r.is_dead && tmp.r.baseAmount.gte(tmp.r.requires)
    },

    update(diff) {

    }
})
