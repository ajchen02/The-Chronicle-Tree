// Experience, a.k.a exp, habit, adv. training(?)

var prices = {
    "swimming": {
        priceStart: d(10),
        priceAdd: d(20),
        lvlDivider: d(5)
    }
}

var skill_dispn = {
    "communication": "Communication",
    "swimming": "Swimming",
    "laboring": "Laboring",
    "cooking": "Cooking",
    "trading": "Trading",
    "fishing": "Fishing",
    "hunting": "Hunting",
    "atk": "攻击",
    "def": "防御",
    "speed": "速度",
    "hp": "耐力",
}

addLayer("e", {
    name: "experience", // This is optional, only used in a few places, If absent it just uses the layer id.
    disp_symbol: "EXP",
    symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: d(0),
        lvlpoints: d(0),
        communication: {
            cur_exp: d(0),
            lvl: d(0),
            nxt_exp: d(100),
        },
        swimming: {
            cur_exp: d(0),
            lvl: d(0),
            nxt_exp: d(100)
        },
        laboring: {
            cur_exp: d(0),
            lvl: d(0),
            nxt_exp: d(100)
        },
        cooking: {
            cur_exp: d(0),
            lvl: d(0),
            nxt_exp: d(100)
        },
        trading: {
            cur_exp: d(0),
            lvl: d(0),
            nxt_exp: d(100)
        },
        fishing: {
            cur_exp: d(0),
            lvl: d(0),
            nxt_exp: d(100)
        },
        hunting: {
            cur_exp: d(0),
            lvl: d(0),
            nxt_exp: d(100)
        },


        atk: {
            cur_exp: d(0),
            lvl: d(0),
            nxt_exp: d(100)
        },
        def: {
            cur_exp: d(0),
            lvl: d(0),
            nxt_exp: d(100)
        },
        speed: {
            cur_exp: d(0),
            lvl: d(0),
            nxt_exp: d(100)
        },
        hp: {
            cur_exp: d(0),
            lvl: d(0),
            nxt_exp: d(100)
        },
        battle_exp_strat: "avg"
    }},
    color: "#27ae60",
    subcolor: "#55efc4",
    requires: d(1), // Can be a function that takes requirement increases into account
    resource: "Reborn points", // Name of prestige currency
    baseResource: "Reborn scores", // Name of resource prestige is based on
    baseAmount() {return player.r.score}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = d(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return d(1)
    },
    tooltip:() => "能力栏",
    tooltipLocked:() => "能力栏",
    prestigeNotify: () => false,


    // upgrades: {
    //     11: {
    //         title: "",
    //         description: "",
    //     }
    // },

    battleExpGainMult() {
        return d(1)
    },

    addBattleExp(exp) {
        let strat = player.e.battle_exp_strat
        exp = exp.mul(tmp.e.battleExpGainMult)

        switch (strat) {
            case "avg":
                player.e.hp.cur_exp = player.e.hp.cur_exp.add(exp.div(4))
                player.e.atk.cur_exp = player.e.atk.cur_exp.add(exp.div(4))
                player.e.def.cur_exp = player.e.def.cur_exp.add(exp.div(4))
                player.e.speed.cur_exp = player.e.speed.cur_exp.add(exp.div(4))
                break;

            case "hp":
            case "atk":
            case "def":
            case "speed":
                player.e[strat].cur_exp = player.e[strat].cur_exp.add(exp)
                break;

        }
        layers.r.addSigil0Score(exp)
        return exp
    },

    addRawExpSurvival(skill, raw_exp) {
        let exp = raw_exp.mul(layers.e.survivalSkillExpMult(skill))
        player.e[skill].cur_exp = player.e[skill].cur_exp.add(exp)
    },

    communicationEffect() {
        let lvl = player.e.communication.lvl.add(buyableEffect("r", 12)[0])
        return lvl.mul(0.2).add(1)
    },

    swimmingEffect() {
        let lvl = player.e.swimming.lvl.add(buyableEffect("r", 11)[0])
        return lvl.mul(0.5).add(1)
    },

    laboringEffect() {
        let lvl = player.e.laboring.lvl.add(buyableEffect("r", 13)[0])
        return lvl.mul(0.2).add(1)
    }, 

    cookingEffect() {
        let lvl = player.e.cooking.lvl.add(buyableEffect("r", 21)[0])
        return lvl.sqrt().mul(0.3).add(1)
    },

    tradingEffect() {
        let lvl = player.e.trading.lvl.add(buyableEffect("r", 22)[0])
        return lvl.sqrt().mul(0.15).add(1)
    },

    fishingEffect() {
        let lvl = player.e.fishing.lvl.add(buyableEffect("r", 23)[0])
        return lvl.sqrt().mul(0.5).add(1)
    }, 

    huntingEffect() {
        let lvl = player.e.hunting.lvl.add(buyableEffect("r", 31)[0])
        return lvl.sqrt().mul(0.1).add(1)
    },


    hpEffect() {
        let lvl = player.e.hp.lvl
        return lvl.pow(0.75).mul(0.2).add(1)
    },

    atkEffect() {
        let lvl = player.e.atk.lvl
        return lvl.pow(0.75).mul(0.2).add(1)
    },

    defEffect() {
        let lvl = player.e.def.lvl
        return lvl.pow(0.75).mul(0.2).add(1)
    },

    speedEffect() {
        let lvl = player.e.speed.lvl
        return lvl.cbrt().mul(0.15).add(1)
    },


    row: 0, // Row the layer is in on the tree (0 is the first row)
    displayRow: "side",
    
    layerShown() {
        return hasAchievement("m", 11)
    },

    lvlpEffect() {
        return player.e.lvlpoints.add(1).pow(0.2)
    },

    survivalSkillExpMult(skill) {
        return tmp.e.lvlpEffect.mul(layers.r.getExtraExpEffect(skill)[1])
    },

    tabFormat: {
        "Survival": {
            content: [
                ["display-text", "</b>Your body will become grow stronger as you proceed,<br>but if you died, all content in this page will reset!</b>", {"font-size": "20px"}],
                "blank",
                ["display-text", function() {
                    return `Your total survival skill level is ${format(player.e.lvlpoints, 0)},<br> Increase skill exp gain by x${format(tmp.e.lvlpEffect)}`
                }, {"font-size": "20px"}],
                "blank",
                ["display-text", function() {
                    return `Communicating lv${format(player.e.communication.lvl, 0)}+${buyableEffect("r", 12)[0]}: Lower every communication time requirement. Current effect: x${format(tmp.e.communicationEffect)}`
                }],
                ["bar", "communicationBar"],
                "blank",
                ["display-text", function() {
                    return `Swimming lv${format(player.e.swimming.lvl, 0)}+${buyableEffect("r", 11)[0]}: Speed up your swimming. Current effect: x${format(tmp.e.swimmingEffect)}`
                }],
                ["bar", "swimmingBar"],
                "blank",
                ["display-text", function() {
                    return `Laboring lv${format(player.e.laboring.lvl, 0)}+${buyableEffect("r", 13)[0]}: Increase manual labor's output. Current effect: x${format(tmp.e.laboringEffect)}`
                }],
                ["bar", "laboringBar"],
                "blank",
                ["display-text", function() {
                    return `Cooking lv${format(player.e.cooking.lvl, 0)}+${buyableEffect("r", 21)[0]}: Increase ${res_name["food"]} conversion efficiency. Current effect: x${format(tmp.e.cookingEffect)}`
                }],
                ["bar", "cookingBar"],
                "blank",
                ["display-text", function() {
                    return `Trading lv${format(player.e.trading.lvl, 0)}+${buyableEffect("r", 22)[0]}: Lower buying cost, Higher selling gain. Current effect: x${format(tmp.e.tradingEffect)}`
                }],
                ["bar", "tradingBar"],
                "blank",
                ["display-text", function() {
                    return `Fishing lv${format(player.e.fishing.lvl, 0)}+${buyableEffect("r", 23)[0]}: Increase the output of water resources. Current effect: x${format(tmp.e.fishingEffect)}`
                }],
                ["bar", "fishingBar"],
                "blank",
                ["display-text", function() {
                    return `Hunting lv${format(player.e.hunting.lvl, 0)}+${buyableEffect("r", 31)[0]}: Increase chances to spot the enemy. Current effect: x${format(tmp.e.huntingEffect)}`
                }],
                ["bar", "huntingBar"]]
        },

        "Combat": {
            content: [
                ["display-text", "</b>Your body will become grow stronger as you proceed,<br>but if you died, all content in this page will reset!</b>", {"font-size": "20px"}],
                "blank",
                
                ["display-text", function() {
                    return `<p>Combat skill experience aren't boosted by survival skill,<br> and will automaticly spilt between four combat skill.</p><br><p>You can also choose to master one of the combat skill to give it all the experience!</p>`
                }, {"font-size": "16px"}],
                "blank",
                ["display-text", function() {
                    return `Endurance lv${format(player.e.hp.lvl, 0)}: Increase Max HP. Current effect: x${format(tmp.e.hpEffect)}`
                }],
                ["row", [["bar", "hpBar"], ["clickable", 11]]],
                "blank",
                ["display-text", function() {
                    return `Attack lv${format(player.e.atk.lvl, 0)}: Increase ATK. Current effect: x${format(tmp.e.atkEffect)}`
                }],
                ["row", [["bar", "atkBar"], ["clickable", 12]]],
                "blank",
                ["display-text", function() {
                    return `Defence lv${format(player.e.def.lvl, 0)}: Increase DEF. Current effect: x${format(tmp.e.defEffect)}`
                }],
                ["row", [["bar", "defBar"], ["clickable", 13]]],
                "blank",
                ["display-text", function() {
                    return `Speed lv${format(player.e.speed.lvl, 0)}: Increase Speed of action. Current effect: x${format(tmp.e.speedEffect)}`
                }],
                ["row", [["bar", "speedBar"], ["clickable", 14]]],
            ],
            unlocked: () => hasAchievement("m", 16)
        }
    },

    
    bars: {
        communicationBar: {
            direction: RIGHT,
            width: 300,
            height: 30,
            fillStyle: {'background-color' : "#27ae60"},
            baseStyle: {'background-color' : "#000000"},
            borderStyle() {return {}},
            progress() { return player.e.communication.cur_exp.div(player.e.communication.nxt_exp) },
            display() { return `Next: ${format(player.e.communication.cur_exp)}/${format(player.e.communication.nxt_exp)}`},
            unlocked: true
        },
        swimmingBar: {
            direction: RIGHT,
            width: 300,
            height: 30,
            fillStyle: {'background-color' : "#27ae60"},
            baseStyle: {'background-color' : "#000000"},
            borderStyle() {return {}},
            progress() { return player.e.swimming.cur_exp.div(player.e.swimming.nxt_exp) },
            display() { return `Next: ${format(player.e.swimming.cur_exp)}/${format(player.e.swimming.nxt_exp)}`},
            unlocked: true
        },
        laboringBar: {
            direction: RIGHT,
            width: 300,
            height: 30,
            fillStyle: {'background-color' : "#27ae60"},
            baseStyle: {'background-color' : "#000000"},
            borderStyle() {return {}},
            progress() { return player.e.laboring.cur_exp.div(player.e.laboring.nxt_exp) },
            display() { return `Next: ${format(player.e.laboring.cur_exp)}/${format(player.e.laboring.nxt_exp)}`},
            unlocked: true
        },
        cookingBar: {
            direction: RIGHT,
            width: 300,
            height: 30,
            fillStyle: {'background-color' : "#27ae60"},
            baseStyle: {'background-color' : "#000000"},
            borderStyle() {return {}},
            progress() { return player.e.cooking.cur_exp.div(player.e.cooking.nxt_exp) },
            display() { return `Next: ${format(player.e.cooking.cur_exp)}/${format(player.e.cooking.nxt_exp)}`},
            unlocked: true
        },
        tradingBar: {
            direction: RIGHT,
            width: 300,
            height: 30,
            fillStyle: {'background-color' : "#27ae60"},
            baseStyle: {'background-color' : "#000000"},
            borderStyle() {return {}},
            progress() { return player.e.trading.cur_exp.div(player.e.trading.nxt_exp) },
            display() { return `Next: ${format(player.e.trading.cur_exp)}/${format(player.e.trading.nxt_exp)}`},
            unlocked: true
        },
        fishingBar: {
            direction: RIGHT,
            width: 300,
            height: 30,
            fillStyle: {'background-color' : "#27ae60"},
            baseStyle: {'background-color' : "#000000"},
            borderStyle() {return {}},
            progress() { return player.e.fishing.cur_exp.div(player.e.fishing.nxt_exp) },
            display() { return `Next: ${format(player.e.fishing.cur_exp)}/${format(player.e.fishing.nxt_exp)}`},
            unlocked: true
        },
        huntingBar: {
            direction: RIGHT,
            width: 300,
            height: 30,
            fillStyle: {'background-color' : "#27ae60"},
            baseStyle: {'background-color' : "#000000"},
            borderStyle() {return {}},
            progress() { return player.e.hunting.cur_exp.div(player.e.hunting.nxt_exp) },
            display() { return `Next: ${format(player.e.hunting.cur_exp)}/${format(player.e.hunting.nxt_exp)}`},
            unlocked: true
        },

        hpBar: {
            direction: RIGHT,
            width: 350,
            height: 40,
            fillStyle: {'background-color' : "#e67e22"},
            baseStyle: {'background-color' : "#000000"},
            borderStyle() {return {"border-radius":"1px"}},
            progress() { return player.e.hp.cur_exp.div(player.e.hp.nxt_exp) },
            display() { return `Next: ${format(player.e.hp.cur_exp)}/${format(player.e.hp.nxt_exp)}`},
            unlocked: true
        },
        atkBar: {
            direction: RIGHT,
            width: 350,
            height: 40,
            fillStyle: {'background-color' : "#e67e22"},
            baseStyle: {'background-color' : "#000000"},
            borderStyle() {return {"border-radius":"1px"}},
            progress() { return player.e.atk.cur_exp.div(player.e.atk.nxt_exp) },
            display() { return `Next: ${format(player.e.atk.cur_exp)}/${format(player.e.atk.nxt_exp)}`},
            unlocked: true
        },
        defBar: {
            direction: RIGHT,
            width: 350,
            height: 40,
            fillStyle: {'background-color' : "#e67e22"},
            baseStyle: {'background-color' : "#000000"},
            borderStyle() {return {"border-radius":"1px"}},
            progress() { return player.e.def.cur_exp.div(player.e.def.nxt_exp) },
            display() { return `Next: ${format(player.e.def.cur_exp)}/${format(player.e.def.nxt_exp)}`},
            unlocked: true
        },
        speedBar: {
            direction: RIGHT,
            width: 350,
            height: 40,
            fillStyle: {'background-color' : "#e67e22"},
            baseStyle: {'background-color' : "#000000"},
            borderStyle() {return {"border-radius":"1px"}},
            progress() { return player.e.speed.cur_exp.div(player.e.speed.nxt_exp) },
            display() { return `Next: ${format(player.e.speed.cur_exp)}/${format(player.e.speed.nxt_exp)}`},
            unlocked: true
        },
    },

    clickables: {
        11: {
            title: () => player.e.battle_exp_strat === "hp" ? "Cancel" : "Master",
            display: () => "",
            style() {
                let bg = player.e.battle_exp_strat === "hp" ? "#e67e22" : "#ffffff"
                return {
                    "background-color": bg,
                    "border-radius": "1px",
                    "min-height": "44px",
                    "margin-left": "30px",
                }
            },
            onClick() {
                player.e.battle_exp_strat = player.e.battle_exp_strat === "hp" ? "avg" : "hp"
            },
            canClick: true,
            unlocked: true
        },
        12: {
            title: () => player.e.battle_exp_strat === "atk" ? "Cancel" : "Master",
            display: () => "",
            style() {
                let bg = player.e.battle_exp_strat === "atk" ? "#e67e22" : "#ffffff"
                return {
                    "background-color": bg,
                    "border-radius": "1px",
                    "min-height": "44px",
                    "margin-left": "30px",
                }
            },
            onClick() {
                player.e.battle_exp_strat = player.e.battle_exp_strat === "atk" ? "avg" : "atk"
            },
            canClick: true,
            unlocked: true,
        },
        13: {
            title: () => player.e.battle_exp_strat === "def" ? "Cancel" : "Master",
            display: () => "",
            style() {
                let bg = player.e.battle_exp_strat === "def" ? "#e67e22" : "#ffffff"
                return {
                    "background-color": bg,
                    "border-radius": "1px",
                    "min-height": "44px",
                    "margin-left": "30px",
                }
            },
            onClick() {
                player.e.battle_exp_strat = player.e.battle_exp_strat === "def" ? "avg" : "def"
            },
            canClick: true,
            unlocked: true,
        },
        14: {
            title: () => player.e.battle_exp_strat === "speed" ? "Cancel" : "Master",
            display: () => "",
            style() {
                let bg = player.e.battle_exp_strat === "speed" ? "#e67e22" : "#ffffff"
                return {
                    "background-color": bg,
                    "border-radius": "1px",
                    "min-height": "44px",
                    "margin-left": "30px",
                }
            },
            onClick() {
                player.e.battle_exp_strat = player.e.battle_exp_strat === "speed" ? "avg" : "speed"
            },
            canClick: true,
            unlocked: true,
        },


    },

    update(diff) {
        let skill_list = ["communication", "swimming", "laboring", "cooking", "trading", "fishing", "hunting"]

        let battle_skills = new Set(["hp", "atk", "def", "speed"])
        skill_list = skill_list.concat(["hp", "atk", "def", "speed"])
        for (let skill of skill_list) {
            let data = player.e[skill]
            if (data.cur_exp.gte(data.nxt_exp)) {

                let priceStart = d(100)
                let priceAdd = d(100)
                let lvlDivider = d(1)

                if (prices[skill]) {
                    priceStart = prices[skill].priceStart
                    priceAdd = prices[skill].priceAdd
                    lvlDivider = prices[skill].lvlDivider
                }

                let affordLvls = Decimal.affordArithmeticSeries(data.cur_exp, priceStart, priceAdd, data.lvl)
                let sumPrice = Decimal.sumArithmeticSeries(affordLvls, priceStart, priceAdd, data.lvl)
    
                data.cur_exp = data.cur_exp.sub(sumPrice)
                data.lvl = data.lvl.add(affordLvls)
                player.e.lvlpoints = player.e.lvlpoints.add(affordLvls.div(lvlDivider))

                data.nxt_exp = priceStart.add(priceAdd.mul(data.lvl))
                layers["r"].addRawScore(affordLvls.div(lvlDivider))

                if (affordLvls.gt(0) && battle_skills.has(skill)) {
                    layers.b.pushBattleLog(`${skill_dispn[skill]} 技能提升到了 ${format(data.lvl)} 级！`)
                }
            }
        }
    }
})
