// Memory, a.k.a Milestones


addLayer("m", {
    name: "memory", // This is optional, only used in a few places, If absent it just uses the layer id.
    disp_symbol: "Memory",
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
        points: d(0),
        milestone_cnt: d(0),
        sigil0_unlocked: false,
    }},
    color: "#8e44ad",
    subcolor: "#a29bfe",
    requires: d(1), // Can be a function that takes requirement increases into account
    resource: "Memory point", // Name of prestige currency
    baseResource: "placeholder", // Name of resource prestige is based on
    baseAmount() {return d(1)}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = d(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return d(1)
    },
    tooltip:() => "Memory",
    tooltipLocked:() => "Memory",
    prestigeNotify: () => false,
    
    achievements: {
        11: {
            name: "Memory of Reborn",
            done(){return player.r.deaths.gte(1)},
            onComplete() {player.m.milestone_cnt = player.m.milestone_cnt.add(1)},
            tooltip() {
                if (hasAchievement("m", this.id)) {
                    return "You recalled this aren't the first time you reborn. But you also remembered that, normally you won't lose memories on reborn."
                } else {
                    return "Locked."
                }
            }
        },
        12: {
            name: "Memory of dry land",
            done() {return player.g.depth_cur.lte(0)},
            onComplete() {player.m.milestone_cnt = player.m.milestone_cnt.add(1)},
            tooltip() {
                if (hasAchievement("m", this.id)) {
                    return "Stand on unfamiliar familiar dry land, you recalled an village near by.<br>Unlock location: Peano The Village."
                } else {
                    return "Locked."
                }
            }
        },
        13: {
            name: "Memory of adventure",
            unlocked: () => hasAchievement("m", 12), 
            onComplete() {player.m.milestone_cnt = player.m.milestone_cnt.add(1)},
            done: () => hasUpgrade("p", 12),
            tooltip() {
                if (hasAchievement("m", this.id)) {
                    return "After communicating with villagers, you memorised the way out of the village. Unlock Upgrade-Set sail from Peano village"
                } else {
                    return "Locked."
                }
            }
        },
        14: {
            name: "Memory of number",
            unlocked: () => hasAchievement("m", 12), 
            onComplete() {player.m.milestone_cnt = player.m.milestone_cnt.add(1)},
            done: () => getBuyableAmount("p", 12).gte(14),
            tooltip() {
                if (hasAchievement("m", this.id)) {
                    return "You recalled the knowledge of number and order of magnitude. Unlock subpage: Reborn-Number"
                } else {
                    return "Complete the communication of village head to unlock."
                }
            }
        },

        15: {
            name: "怠惰的记忆",
            unlocked: () => hasAchievement("m", 12), 
            onComplete() {player.m.milestone_cnt = player.m.milestone_cnt.add(1)},
            done: () => getBuyableAmount("p", 14).gte(8),
            tooltip() {
                if (hasAchievement("m", this.id)) {
                    return "在见识了一个流浪汉的生活之后，你意识到偷懒有时也是一门艺术。解锁页面：怠惰"
                } else {
                    return "Locked."
                }
            }
        },

        16: {
            name: "战斗的记忆",
            unlocked: () => player.b.battle_unlocked || hasUpgrade("p", 34),
            onComplete() {
                player.m.milestone_cnt = player.m.milestone_cnt.add(1)
                player.b.battle_unlocked = true
            },
            done: () => player.b.in_battle,
            tooltip() {
                if (hasAchievement("m", this.id)) {
                    return "你回想起自己曾经很擅长战斗，但现在的身体并不适应。解锁子页面：经验-战斗"
                } else {
                    return "Locked."
                }
            }
        },

        21: {
            name: "村庄的记忆",
            unlocked: () => hasAchievement("m", 16),
            onComplete() {player.m.milestone_cnt = player.m.milestone_cnt.add(1)},
            done: () => tmp.p.layerFinished,
            tooltip() {
                if (hasAchievement("m", this.id)) {
                    return "你已经了解了皮亚诺村的一切——如果之后再回到这里，你的一切都会更有效率。皮亚诺村投入时间x2"
                } else {
                    return "购买皮亚诺村的全部内容以解锁"
                }
            }
        },

        22: {
            name: "椭圆形符号的记忆",
            unlocked: () => hasAchievement("m", 16),
            onComplete() {player.m.milestone_cnt = player.m.milestone_cnt.add(1)},
            done: () => player.m.sigil0_unlocked,
            tooltip() {
                if (hasAchievement("m", this.id)) {
                    return "在你的掌心，镶嵌着一枚椭圆形的角质鳞片，你感受到其中寄宿着非凡而古老的力量。解锁：重生-数字-符号0"
                } else {
                    return "Locked."
                }
            }
        },

        23: {
            name: "农场的记忆",
            unlocked: () => hasUpgrade("mp", 16) || hasAchievement("m", 23),
            onComplete() {player.m.milestone_cnt = player.m.milestone_cnt.add(1)},
            done: () => getBuyableAmount("mp", 22).gte(8),
            tooltip() {
                if (hasAchievement("m", this.id)) {
                    return "农场的陌生人解放了你手中符号的力量——现在，你可以通过献上材料，增强它的力量。解锁：重生-数字-喂食(TODO)"
                } else {
                    return "Locked."
                }
            }
        }
    },


    infoboxes: {
        desc: {
            title: "About Memory",
            body() { return "As the journey continue, lost memories may gradually retrieved -- or new ones may gained. Memories will be preserved forever, even after the death and reborn." }
        }
    },

    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown() {
        return player.r.deaths.gte(1)
    },
    unlocked() {
        return player.r.deaths.gte(1)
    },

    tabFormat: [["display-text", function() {
           return `You have <span style='color:#8e44ad; font-size:25px'>${format(player.m.milestone_cnt, 0)}</span> Memories.`  
        }, {"font-size": "20px"}],
        "blank",
        ["infobox", "desc"],
        "blank",
        "achievements"],

    update(diff) {
        
    }
})