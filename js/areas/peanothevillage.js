function clickable_style(bg) {
    return {
        "background-color": bg,
        "width": "140px",
        "height": "160px",
        "border-radius": "1px",
        "margin-bottom": "10px"
    }
}

addLayer("p", {
    name: "Peano The Village", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "p", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: d(0),
    }},
    row: 0,
    layerShown() {
        return hasAchievement("m", 12)
    },
    canReset() {
        return (!player.r.is_dead && tmp.g.isInited)
    },
    color: "#636e72",
    requires: d(1), // Can be a function that takes requirement increases into account
    resource: "Spent time", // Name of prestige currency
    baseResource: "Free time", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.75, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = d(1)
        if (hasUpgrade("p", 11))
            mult = mult.mul(upgradeEffect("p", 11))
        if (hasUpgrade("p", 12))
            mult = mult.mul(upgradeEffect("p", 12))
        if (hasUpgrade("p", 13))
            mult = mult.mul(upgradeEffect("p", 13))

        if (hasAchievement("m", 21)) {
            mult = mult.mul(2)
        }
        mult = mult.mul(buyableEffect("p", 11))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = d(1)
        return exp
    },
    tooltip: () => `Spent <br>
        &nbsp; ${formatWhole(player.p.points)}`,
    tooltipLocked: () => "Peano Village",
    hotkeys: [
        {key: "p", description: "p: 将空余时间投入皮亚诺村区域", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    nodeBgStyle: {
        "clip-path": "polygon(34% 14%, 75% 0%, 95% 80%, 75% 100%, 41% 85%, 16% 43%)",
    },

    nodeStyle: {
        "--bg-sub-color": "#2d3436",
    },


    upgrades: {
        11: {
            title: "Wander",
            description: "Wander in town and get familiar with the roads. Local spent time efficiency x 1.5",
            effect: () => d(1.5),
            cost: d(10),
        },
        12: {
            title: "Ask for directions",
            description: "Asking villagers who seem to have nothing to do. Local spent time efficiency x 1.3",
            unlocked: () => hasUpgrade("p", 11),
            effect: () => d(1.3),
            cost: () => d(20).div(tmp.e.communicationEffect),
        },
        13: {
            title: "Talk a bit",
            description: "Learn about the village from the villagers passing by. Local spent time efficiency x 1.2",
            unlocked: () => hasUpgrade("p", 11),
            effect: () => d(1.2),
            cost: () => d(100).div(tmp.e.communicationEffect),
        },
        21: {
            title: "Visiting the village head",
            description: "There may be some important information to be learned from the village head.",
            unlocked: () => hasUpgrade("p", 11),
            cost: d(20),
        },
        22: {
            title: "Visiting the tavern",
            description: "Tavern is always a good place to gather information.",
            unlocked: () => hasUpgrade("p", 11),
            cost: d(30),
        },
        23: {
            title: "Visiting the fish shop",
            description: "The sea is always an important resource for villagers living by.",
            unlocked: () => hasUpgrade("p", 11),
            cost: d(40),
        },
        24: {
            title: "Visiting the farmhouse",
            description: "Help out with some farm work, perhaps you can make some money.",
            unlocked: () => hasUpgrade("p", 11),
            cost: d(30),
        },
        25: {
            title: "Visiting blacksmith",
            description: "For an adventure, you have to prepare tools and weapons.",
            unlocked: () => hasUpgrade("p", 11),
            cost: d(40),
        },
        26: {
            title: "Visiting store",
            description: "It's a humble shop in the village, but it might have something that could be useful in an adventure.",
            unlocked: () => hasUpgrade("p", 11),
            cost: d(100),
        },

        31: {
            title: "Buy a fishing rod",
            description: "To make fishing possible. <i>Fishing is a must-have FEATURE of RPGs, can't go without a taste</i>",
            unlocked: () => hasUpgrade("p", 23),
            cost: () => d(8).div(tmp.e.tradingEffect),
            currencyDisplayName: () => res_name["gold"],
            currencyInternalName: "gold",
            currencyLocation: () => player.i,
            canAfford: () => tmp.i.canAddInventory,
            onPurchase() {
                player.g.fishing_unlocked = true
                layers["i"].addInventory({
                    equiptype: "fishingrod",
                    name: "fishingrod0",
                    number: d(1),
                })
            }
        },

        32: {
            title: "Buy an iron axe",
            description: "To make chopping trees possible. <i>Chopping tree is a must-have FEATURE of RPGs, can't go without a taste</i>",
            unlocked: () => hasUpgrade("p", 25),
            cost: () => d(20).div(tmp.e.tradingEffect),
            currencyDisplayName: () => res_name["gold"],
            currencyInternalName: "gold",
            currencyLocation: () => player.i,
            canAfford: () => tmp.i.canAddInventory,
            onPurchase() {
                layers["i"].addInventory({
                    equiptype: "axe",
                    name: "axe0",
                    number: d(1),
                })
            }
        },

        33: {
            title: "Buy an iron pickaxe",
            description: "To make mining possible. <i>Mining is a must-have FEATURE of RPGs, can't go without a taste</i>",
            unlocked: () => hasUpgrade("p", 25),
            cost: () => d(50).div(tmp.e.tradingEffect),
            currencyDisplayName: () => res_name["gold"],
            currencyInternalName: "gold",
            currencyLocation: () => player.i,
            canAfford: () => tmp.i.canAddInventory,
            onPurchase() {
                layers["i"].addInventory({
                    equiptype: "pickaxe",
                    name: "pickaxe0",
                    number: d(1),
                })
            }
        },

        34: {
            title: "Buy an iron sword",
            description: "To make fighting possible. <i>Fighting is a must-have FEATURE of RPGs, can't go without a taste</i>",
            unlocked: () => hasUpgrade("p", 25),
            cost: () => d(100).div(tmp.e.tradingEffect),
            currencyDisplayName: () => res_name["gold"],
            currencyInternalName: "gold",
            currencyLocation: () => player.i,
            canAfford: () => tmp.i.canAddInventory,
            onPurchase() {
                layers["i"].addInventory({
                    equiptype: "weapon",
                    name: "sword0",
                    number: d(1),
                })
            }
        },

        35: {
            title: "Set sail from Peano village",
            description: "You need to have at least one of an axe, iron pickaxe or iron sword.<br> Unlock: The plain of squares.",
            unlocked: () => hasAchievement("m", 13),
            cost: d(20),
            canAfford: () => hasUpgrade("p", 32) || hasUpgrade("p", 33) || hasUpgrade("p", 34),
            currencyDisplayName: () => res_name["food"],
            currencyInternalName: "food",
            currencyLocation: () => player.i
        },

        41: {
            title: "Blacksmith's lesson I",
            description: () => `Use ${format(d(40).div(tmp.e.tradingEffect))} ${res_name["fur"]} And ${format(d(200).div(tmp.e.tradingEffect))} ${res_name["gold"]} As a gift,
                Permanently unlock feature: Item - Forge, which allows you to use materials to create new equipment.`,
            unlocked: () => hasUpgrade("p", 35),
            cost: () => d(300).div(tmp.e.communicationEffect),
            canAfford: () => player.i.fur.gte(d(40).div(tmp.e.tradingEffect)) && player.i.gold.gte(d(200).div(tmp.e.tradingEffect)),
            onPurchase() {
                player.i.fur = player.i.fur.sub(d(40).div(tmp.e.tradingEffect))
                player.i.gold = player.i.gold.sub(d(200).div(tmp.e.tradingEffect))
                player.i.making_unlocked = true
            }
        },
        
        42: {
            title: "Blacksmith's lesson II",
            description: () => `Use ${format(d(40).div(tmp.e.tradingEffect))} ${res_name["fur"]} And ${format(d(200).div(tmp.e.tradingEffect))} ${res_name["gold"]} As a gift,
                Permanently unlock feature: Item - Baking, which allows you to use materials to raise equipments' number.`,
            unlocked: () => hasUpgrade("p", 35),
            cost: () => d(300).div(tmp.e.communicationEffect),
            canAfford: () => player.i.fur.gte(d(40).div(tmp.e.tradingEffect)) && player.i.gold.gte(d(200).div(tmp.e.tradingEffect)),
            onPurchase() {
                player.i.fur = player.i.fur.sub(d(40).div(tmp.e.tradingEffect))
                player.i.gold = player.i.gold.sub(d(200).div(tmp.e.tradingEffect))
                player.i.forge_unlocked = true
            }
        }
    },

    buyables: {
        11: {
            title: "Talk with village head",
            cost(x) {
                c = x.mul(5).add(10)
                c = c.div(tmp.e.communicationEffect).mul(buyableEffect("p", 13))
                return c
            },
            display() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                let ret = `Progress: ${format(cur_amount, 0)}/7\n\n`
                if (cur_amount.gte(1) && cur_amount.lte(7)) {
                    ret += full_dialogue["p11"][format(cur_amount, 0)-1] + "\n\n"
                }
                if (cur_amount.gte(3)) {
                    ret += `Currently: Local spent time efficiency x${format(this.effect())}\n`
                }
                if (cur_amount.lt(7)) {
                    ret += `Next: ${format(this.cost(cur_amount))} spent time`
                }
                return ret
            },
            unlocked() {
                return hasUpgrade(this.layer, 21)
            },
            purchaseLimit: d(7),
            effect() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                return cur_amount.gte(3) ? d(1.2).pow(cur_amount.sub(2).sqrt()) : d(1);
            },
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }
        },
        12: {
            title: "Talk with village head II - Numerology 101",
            cost(x) {
                c = x.mul(5).add(50)
                c = c.div(tmp.e.communicationEffect).mul(buyableEffect("p", 13))
                return c
            },
            display() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                let ret = `Progress: ${format(cur_amount, 0)}/14\n\n`
                if (cur_amount.gte(1) && cur_amount.lte(14)) {
                    ret += full_dialogue["p12"][format(cur_amount, 0)-1] + "\n\n"
                }
                if (cur_amount.lt(14)) {
                    ret += `Next: ${format(this.cost(cur_amount)) } spent time`
                }
                return ret
            },
            unlocked() {
                return getBuyableAmount(this.layer, 11).gte(7)
            },
            purchaseLimit: d(14),
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }
        },
        13: {
            title: "Buying wine, and talking to drinkers",
            cost(x) {
                let c = x.mul(1).add(2)
                c = c.div(tmp.e.communicationEffect).mul(buyableEffect("p", 13))
                return c
            },
            display() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                let ret = `Progress: ${format(cur_amount, 0)}/8\n\n`
                if (cur_amount.gte(1) && cur_amount.lte(8)) {
                    ret += full_dialogue["p13"][format(cur_amount, 0)-1] + "\n\n"
                }
                ret += `Currently: conversation in village cost x${format(this.effect())}\n`
                if (cur_amount.lt(8)) {
                    ret += `Next: ${format(this.cost(cur_amount))} ${res_name["gold"]}`
                }
                return ret
            },
            unlocked() {
                return hasUpgrade(this.layer, 22)
            },
            purchaseLimit: d(8),
            effect() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                return d(1).sub(cur_amount.mul(0.05))
            },
            canAfford() { return player.i.gold.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player.i.gold = player.i.gold.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }
        },
        14: {
            title: "Give food to the homeless on the roadside",
            cost(x) { 
                return d(2).add(d(1).mul(x)).mul(buyableEffect("p", 13))
            },
            display() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                let ret = "Progress: " + format(cur_amount, 0) + "/8\n"
                if (cur_amount.gte(1) && cur_amount.lte(8)) {
                    ret += full_dialogue["p14"][format(cur_amount, 0)-1] + "\n"
                }
                if (cur_amount.lt(8)) {
                    ret += `Next: ${format(this.cost(cur_amount))} ${res_name["food"]}`
                }
                return ret
            },
            unlocked() {
                return hasUpgrade(this.layer, 13)
            },
            purchaseLimit: d(8),
            effect() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                return d(1).sub(cur_amount.mul(0.05))
            },
            canAfford() { return player.i.food.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player.i.food = player.i.food.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }
        },
    },

    clickables: {
        11: {
            "title": "Helping out at tavern",
            display() {
                let disp = `Use 50% of current spent time to earn small amount of gold, and improve your communiation.\n
                Gain:
                ${format(player.p.points.mul(0.5).mul(tmp.p.tavernIncome))} ${res_name["gold"]}
                ${format(player.p.points.mul(0.5).mul(tmp.p.tavernExp))} Experience`
                return disp
            },
            style() {
                return clickable_style(player.r.is_dead ? "#ffffff" : "#f39c12")
            },
            onClick() {
                let data = player.p
                let t = data.points.mul(0.5)
                data.points = data.points.sub(t)
                player.i.gold = player.i.gold.add(t.mul(tmp.p.tavernIncome))
                player.e.communication.cur_exp = player.e.communication.cur_exp.add(t.mul(tmp.p.tavernExp))
            },
            canClick() {
                return !player.r.is_dead && player.p.points.gt(0)
            },
            unlocked() {
                return hasUpgrade(this.layer, 22)
            }
        },
        
        12: {
            "title": "Helping out at farmhouse",
            display() {
                let disp = `Use 50% of current spent time to earn large amount of gold, and improve your labor.\n
                Gain:
                ${format(player.p.points.mul(0.5).mul(tmp.p.farmGoldIncome))} ${res_name["gold"]}
                ${format(player.p.points.mul(0.5).mul(tmp.p.farmFoodIncome))} ${res_name["food"]}
                ${format(player.p.points.mul(0.5).mul(tmp.p.farmExp))} Experience`
                return disp
            },
            style() {
                return clickable_style(player.r.is_dead ? "#ffffff" : "#f39c12")
            },
            onClick() {
                let data = player.p
                let t = data.points.mul(0.5)
                data.points = data.points.sub(t)
                player.i.gold = player.i.gold.add(t.mul(tmp.p.farmGoldIncome))
                player.i.food = player.i.food.add(t.mul(tmp.p.farmFoodIncome))
                player.e.laboring.cur_exp = player.e.laboring.cur_exp.add(t.mul(tmp.p.farmExp))
            },
            canClick: () => !player.r.is_dead && player.p.points.gt(0),
            unlocked: () => hasUpgrade("p", 24),
        },

        
        13: {
            "title": "Sell fish",
            display() {
                let disp = `Sell 50% of current ${res_name["fish"]} for gold, and improve your trading.\n
                Trade ${format(player.i.fish.mul(0.5))} ${res_name["fish"]} with:
                ${format(player.i.fish.mul(0.5).mul(tmp.p.sellFishIncome))} ${res_name["gold"]}
                ${format(player.i.fish.mul(0.5).mul(tmp.p.sellFishExp))} Experience`
                return disp
            },
            style() {
                return clickable_style(player.r.is_dead ? "#ffffff" : "#f39c12")
            },
            onClick() {
                let data = player.i
                let f = data.fish.mul(0.5)
                data.fish = data.fish.sub(f)
                data.gold = data.gold.add(f.mul(tmp.p.sellFishIncome))
                player.e.trading.cur_exp = player.e.trading.cur_exp.add(f.mul(tmp.p.sellFishExp))
            },
            canClick: () => !player.r.is_dead && player.i.fish.gt(0),
            unlocked: () => hasUpgrade("p", 23),
        },

        
        14: {
            "title": "Cook fish",
            display() {
                let disp = `Cook 50% of current ${res_name["fish"]} to make ${res_name["food"]}, and improve your cooking.\n
                Trade ${format(player.i.fish.mul(0.5))} ${res_name["fish"]} with:
                ${format(player.i.fish.mul(0.5).mul(tmp.p.dealFishIncome))} ${res_name["food"]}
                ${format(player.i.fish.mul(0.5).mul(tmp.p.dealFishExp))} Experience`
                return disp
            },
            style() {
                return clickable_style(player.r.is_dead ? "#ffffff" : "#f39c12")
            },
            onClick() {
                let data = player.i
                let f = data.fish.mul(0.5)
                data.fish = data.fish.sub(f)
                data.food = data.food.add(f.mul(tmp.p.dealFishIncome))
                player.e.cooking.cur_exp = player.e.cooking.cur_exp.add(f.mul(tmp.p.dealFishExp))
            },
            canClick: () => !player.r.is_dead && player.i.fish.gt(0),
            unlocked: () => hasUpgrade("p", 23),
        },

        
        15: {
            "title": "Buy foods",
            display() {
                let disp = `Cost ${res_name["gold"]} to buy ${res_name["food"]}, and improve your trading.\n
                Trade:
                + 10 ${res_name["food"]} for\n- ${format(tmp.p.buyFoodCost)} ${res_name["gold"]}
                ${format(tmp.p.buyFoodExp)} Experience`
                return disp
            },
            style() {
                return clickable_style(player.r.is_dead ? "#ffffff" : "#f39c12")
            },
            onClick() {
                let data = player.i
                data.food = data.food.add(10)
                data.gold = data.gold.sub(tmp.p.buyFoodCost)
                player.e.trading.cur_exp = player.e.trading.cur_exp.add(tmp.p.buyFoodExp)
            },
            canClick: () => !player.r.is_dead && player.i.gold.gt(tmp.p.buyFoodCost),
            unlocked: () => hasUpgrade("p", 26),
        }
    },

    infoboxes: {
        lore: {
            title: "Story",
            body() {
                let disp = "You have arrived in an unusually peaceful small village beside sea. You have a faint impression of the place, but no one seems to recognise you."

                let keys = [11, 12, 13, 14]
                let dkeys = ["p11", "p12", "p13", "p14"]
                let titles = ["Talk with village head", "Talk with village head II - <br>Numerology 101", "Buying wine, and talking to drinkers", "Give food to the homeless on the roadside"]

                for (let i = 0; i < keys.length; i++) {       
                    if (tmp.p.buyables[keys[i]].unlocked) {
                        disp += `<p  style='margin-top: 10px'><h2> ${titles[i]} </h2><p>`
                        let amount = getBuyableAmount("p", keys[i])
                        for (j = 0; j < full_dialogue[dkeys[i]].length; j++) {
                            if (amount.gt(j)) {
                                disp += `<p style='margin-top: 5px'>${full_dialogue[dkeys[i]][j]}</p>`
                            }
                        }
                        disp += "<p style='margin-top: 5px'> --------------------------------------</p>"
                    }
                }
                return disp
            }
        }
    },

    layerFinished() {
        let need_upgrade_list = [11, 12, 13, 21, 22, 23, 24, 25, 26, 31, 32, 33, 34, 35, 41, 42]
        let buyable_finish_list = {11: 7, 12: 14, 13: 8, 14: 8}
        for (let d of need_upgrade_list) {
            if (!hasUpgrade("p", d)) return false
        }
        for (let b in buyable_finish_list) {
            if (getBuyableAmount("p", b).lt(buyable_finish_list[b])) return false
        }
        return true
    },

    tavernIncome() {
        return d(0.05)
    },

    tavernExp() {
        return d(10).mul(layers.e.survivalSkillExpMult("communication"))
    },

    farmGoldIncome() {
        return d(0.05).mul(tmp.e.laboringEffect)
    },

    farmFoodIncome() {
        return d(0.02).mul(tmp.e.laboringEffect)
    },
    
    farmExp() {
        return d(10).mul(layers.e.survivalSkillExpMult("laboring"))
    },

    sellFishIncome() {
        return d(0.1).mul(tmp.e.tradingEffect)
    },
    
    sellFishExp() {
        return d(10).mul(layers.e.survivalSkillExpMult("trading"))
    },

    dealFishIncome() {
        return d(0.05).mul(tmp.e.cookingEffect)
    },
    
    dealFishExp() {
        return d(10).mul(layers.e.survivalSkillExpMult("cooking"))
    },

    buyFoodCost() {
        return d(20).div(tmp.e.tradingEffect)
    },
    
    buyFoodExp() {
        return d(10).mul(layers.e.survivalSkillExpMult("trading"))
    },

    update(diff) {
        if (hasUpgrade("r", 11) && tmp.g.isInited) {
            let auto_gain = tmp.pointGen.mul(0.5).mul(diff)
            if (hasAchievement("m", 21)) {
                auto_gain = auto_gain.mul(2)
            }
            player.p.points = player.p.points.add(auto_gain)

            if (hasUpgrade("r", 13)) {
                let t = auto_gain.mul(tmp.p.gainMult).mul(0.5)
    
                player.i.gold = player.i.gold.add(t.mul(tmp.p.tavernIncome))
                player.e.communication.cur_exp = player.e.communication.cur_exp.add(t.mul(tmp.p.tavernExp))

                player.i.gold = player.i.gold.add(t.mul(tmp.p.farmGoldIncome))
                player.i.food = player.i.food.add(t.mul(tmp.p.farmFoodIncome))
                player.e.laboring.cur_exp = player.e.laboring.cur_exp.add(t.mul(tmp.p.farmExp))
            }
        }
    },

    tabFormat: {
        "Main": {
            content: [
            ["display-text", function() {
                return `In Peano the village, You have <b> ${format(player.p.points)} </b> Spent time`    
            }, {"font-size": "20px"}],
            
            "blank",
            "prestige-button",
            "blank",
            "upgrades",
            "blank",
            "buyables",
            "blank",
            "clickables",
            "blank",
        ]},
        "Story": {
            content: [
                ["infobox", "lore"]
            ]
        }
    },
    
    branches() {return ['g']},
})