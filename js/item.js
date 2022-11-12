// Items, including variant resources, equipments

var res_name = {
    "gold": "Gold",
    "food": "Food",
    "fish": "Fish",
    "wood": "Wood",
    "fiber": "Fiber",
    "mineral": "Mineral",
    "fur": "Fur",
}

var res_list = [
    "gold", "food", "fish", "wood", "fiber", "mineral", "fur"
]

let inventory_buyable_style = {
    "width": "200px",
    "height": "120px",
    "margin-top": "10px",
    "border-radius": "0px",
    "border": "1px",
    "border-color": "rgba(0, 0, 0, 0.125)"
}

addLayer("i", {
    name: "Item", // This is optional, only used in a few places, If absent it just uses the layer id.
    disp_symbol: "ＲＳＣ",
    symbol: "I", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { 
        let inv = []
        for (let i = 0; i < 64; i++) {
            inv.push({
                exist: false, 
                equiptype: "", 
                number: d(0), 
                name: ""
            })
        }

        return {
            unlocked: true,
            points: d(0),
            food: d(0),
            bestfood: d(0),
            gold: d(0),
            bestgold: d(0),
            fish: d(0),
            bestfish: d(0),
            wood: d(0),
            bestwood: d(0),
            fiber: d(0),
            bestfiber: d(0),
            mineral: d(0),
            bestmineral: d(0),
            fur: d(0),
            bestfur: d(0),

            equips: {
                fishingrod: {
                    number: d(1),
                    equipped: false,
                    name: "",
                },
                axe: {
                    number: d(1),
                    equipped: false,
                    name: "",
                },
                pickaxe: {
                    number: d(1),
                    equipped: false,
                    name: "",
                },
                weapon: {
                    number: d(1),
                    equipped: false,
                    name: "",
                },
                shield: {
                    number: d(1),
                    equipped: false,
                    name: "",
                },
                armor: {
                    number: d(1),
                    equipped: false,
                    name: "",
                },
                ring: {
                    number: d(1),
                    equipped: false,
                    name: "",
                }
            },

            inv_slots: 10, // current unlocked inventory slots
            inventory: inv,
            cur_invs: 0, // curently occupied inventory slots
            discard_selected: false,
            forge_selected: false,
            selected_inv_ind: -1,
            forge_unlocked: false,
            making_unlocked: false
        }
    },
    color: "#2c3e50",
    subcolor: "#b2bec3",
    requires: d(1), // Can be a function that takes requirement increases into account
    resource: "物品点", // Name of prestige currency
    baseResource: "重生分数", // Name of resource prestige is based on
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
    tooltip:() => {
        if (player.i.cur_invs >= player.i.inv_slots) {
            return "Inventory: Bag is full!"
        }
        return "Inventory"
    },
    tooltipLocked:() => "Inventory",
    prestigeNotify: () => false,

    canAddInventory() {
        return player.i.cur_invs < player.i.inv_slots
    },

    addInventory(equip_info) {
        let i = 0
        for (; i < player.i.inv_slots; i++) {
            if (!player.i.inventory[i].exist) {
                break
            }
        }
        let cur_inv = player.i.inventory[i]

        cur_inv.exist = true
        cur_inv.equiptype = equip_info.equiptype
        cur_inv.name = equip_info.name
        cur_inv.number = equip_info.number

        player.i.cur_invs += 1
    },

    discardInventory(id) {
        if (!player.i.inventory[id].exist) return

        player.i.inventory[id].exist = false
        player.i.cur_invs -= 1
    },

    removeEquip(type) {
        let i = 0
        for (; i < player.i.inv_slots; i++) {
            if (!player.i.inventory[i].exist) {
                break
            }
        }
        let cur_inv = player.i.inventory[i]
        cur_inv.exist = true
        let cur_equip = player.i.equips[type]

        cur_inv.name = cur_equip.name
        cur_inv.number = cur_equip.number
        cur_inv.equiptype = type
        
        cur_equip.equipped = false
        player.i.cur_invs += 1
    },

    
    selectedInvDisplay() {
        let ind = player.i.selected_inv_ind
        if (ind < 0) return undefined

        let equip = player.i.inventory[ind]
        let dispn = full_equips[equip.name].dispn
        return ` ${dispn}, Number ${format(equip.number)}`
    },

    selectedForgeCosts() {

        let ind = player.i.selected_inv_ind
        if (ind < 0) return undefined
        
        let equip = player.i.inventory[ind]
        if (!equip) return undefined

        let costs = full_equips[equip.name].cost

        let min_div = undefined

        for (let res_n in costs) {
            let res_div = player.i[res_n].div(costs[res_n])
            if (!min_div || res_div.lt(min_div)) {
                min_div = res_div
            }
        }

        let ret_costs = {div: min_div}
        
        for (let res_n in costs) {
            ret_costs[res_n] = min_div.mul(costs[res_n])
        }
        return ret_costs
    },

    forgeCostDisplay() {
        let costs = tmp.i.selectedForgeCosts
        if (!costs) return undefined
        let disp = ""
        for (let res_n in costs) {
            if (res_n == "div") continue
            disp += `
            ${format(costs[res_n])} ${res_name[res_n]}`
        }
        return disp
    },

    forgeExpectation() {
        let costs = tmp.i.selectedForgeCosts
        if (!costs) return undefined

        let ind = player.i.selected_inv_ind
        let cur_num = player.i.inventory[ind].number

        let new_num = cur_num.cube().add(costs.div).cbrt()
        
        return `${format(new_num)}`
    },

    forgeEquipment() {
        let costs = tmp.i.selectedForgeCosts
        if (!costs) return undefined
        
        let ind = player.i.selected_inv_ind
        let cur_num = player.i.inventory[ind].number

        let new_num = cur_num.cube().add(costs.div).cbrt()
        player.i.inventory[ind].number = new_num

        for (let res_n in costs) {
            if (res_n == "div") continue
            player.i[res_n] = player.i[res_n].sub(costs[res_n])
        }
    },

    applyEquipmentBuffs() {
        const elist = ["weapon", "armor", "shield", "ring"]
        for (let e of elist) {
            if (player.i.equips[e].equipped) {
                let name = player.i.equips[e].name
                if (full_equips[name].applyEffect) {
                    full_equips[name].applyEffect(player.i.equips[e].number)
                }
            }
        }
    },

    possibleEffect(etype, ename, default_eff) {
        if (player.i.equips[etype].equipped && player.i.equips[etype].name == ename) {
            return full_equips[ename].effect(player.i.equips[etype].number)
        }
        return default_eff
    },


    equipDisplay(etype) {
        let inv = player.i.equips[etype]
        if (!inv.equipped) return ""

        let disp = full_equips[inv.name].dispn + "<br>"
        disp += `Number: ${format(inv.number)}<br>`

        if (full_equips[inv.name].desc) {
            disp += full_equips[inv.name].desc(inv.number.cube().mul(tmp.r.physicalEffect.cube()).sqrt(), inv.number)
        }

        return disp
    },

    canFight() {
        return (player.i.equips.weapon.equipped || hasUpgrade("r", 12))
    },

    clickables: {
        11: {
            title: "Weapon",
            display: () => layers.i.equipDisplay("weapon"),
            style() {
                return {
                    "background-color": "#3498db",
                    "border-radius": "0px"
                }
            },
            onClick() {layers["i"].removeEquip("weapon")},
            canClick: () => player.i.equips.weapon.equipped && tmp.i.canAddInventory
        },
        12: {
            title: "Shield",
            display: () => layers.i.equipDisplay("shield"),
            style() {
                return {
                    "background-color": "#3498db",
                    "border-radius": "0px"
                }
            },
            onClick() {layers["i"].removeEquip("shield")},
            canClick: () => player.i.equips.shield.equipped && tmp.i.canAddInventory
        },
        13: {
            title: "Armor",
            display: () => layers.i.equipDisplay("armor"),
            style() {
                return {
                    "background-color": "#3498db",
                    "border-radius": "0px"
                }
            },
            onClick() {layers["i"].removeEquip("armor")},
            canClick: () => player.i.equips.armor.equipped && tmp.i.canAddInventory
        },
        14: {
            title: "Ring",
            display: () => layers.i.equipDisplay("ring"),
            style() {
                return {
                    "background-color": "#3498db",
                    "border-radius": "0px"
                }
            },
            onClick() {layers["i"].removeEquip("ring")},
            canClick: () => player.i.equips.ring.equipped && tmp.i.canAddInventory
        },
        21: {
            title: "Rods",
            display: () => layers.i.equipDisplay("fishingrod"),
            style() {
                return {
                    "background-color": "#3498db",
                    "border-radius": "0px"
                }
            },
            onClick() {layers["i"].removeEquip("fishingrod")},
            canClick: () => player.i.equips.fishingrod.equipped && tmp.i.canAddInventory
        },
        22: {
            title: "Axe",
            display: () => layers.i.equipDisplay("axe"),
            style() {
                return {
                    "background-color": "#3498db",
                    "border-radius": "0px"
                }
            },
            onClick() {layers["i"].removeEquip("axe")},
            canClick: () => player.i.equips.axe.equipped && tmp.i.canAddInventory
        },
        23: {
            title: "Pickaxe",
            display: () => layers.i.equipDisplay("pickaxe"),
            style() {
                return {
                    "background-color": "#3498db",
                    "border-radius": "0px"
                }
            },
            onClick() {layers["i"].removeEquip("pickaxe")},
            canClick: () => player.i.equips.pickaxe.equipped && tmp.i.canAddInventory
        },

        31: {
            title: "Discard",
            display() {
                if (player.i.cur_invs * 2 <= player.i.inv_slots) {
                    return `Inventory is pretty empty rn.`
                }
                if (player.i.discard_selected) {
                    if (player.i.selected_inv_ind >= 0) {
                        let selected_inv_desc = tmp.i.selectedInvDisplay
                        return `Selected: ${selected_inv_desc}
                            Click me again to discard this equipment.
                            This is irreversible, please be careful!`
                    } else {
                        return `Select an equipment in inventory,
                            or click here to cancel.`
                    }
                } else {
                    return `Select an equipment in inventory to discard.
                    This is irreversible, please be careful!`
                }
            },
            style() {
                return {
                    "background-color": player.i.discard_selected ? "#3498db": "#ffffff",
                    "border-radius": "1px"
                }
            },
            onClick() {
                if (!player.i.discard_selected) {
                    player.i.discard_selected = true
                    player.i.forge_selected = false
                    player.i.selected_inv_ind = -1
                } else {
                    if (player.i.selected_inv_ind >= 0) {
                        // discard
                        layers["i"].discardInventory(player.i.selected_inv_ind)
                        player.i.discard_selected = false
                    } else {
                        player.i.discard_selected = false
                    }
                }
            },
            canClick: () => player.i.cur_invs * 2 > player.i.inv_slots
        },

        
        32: {
            title: "Baking",
            display() {
                if (!player.i.forge_unlocked) {
                    return `Locked.`
                }
                if (player.i.forge_selected) {
                    if (player.i.selected_inv_ind >= 0) {
                        let selected_inv_desc = tmp.i.selectedInvDisplay
                        let cost_display = tmp.i.forgeCostDisplay
                        let number_forged = tmp.i.forgeExpectation
                        return `Click me again to baking.
                            Selected: ${selected_inv_desc}
                            Baking Cost: ${cost_display}
                            Number After: ${number_forged}`
                    } else {
                        return `Select an equipment,
                        or click here to cancel`
                    }
                } else {
                    return `Select an equipment in inventory to baking,
                        Raise equipments number`
                }
            },
            style() {
                return {
                    "background-color": player.i.forge_selected ? "#3498db": "#ffffff",
                    "border-radius": "1px"
                }
            },
            onClick() {
                if (!player.i.forge_selected) {
                    player.i.forge_selected = true
                    player.i.discard_selected = false
                    player.i.selected_inv_ind = -1
                } else {
                    if (player.i.selected_inv_ind >= 0) {
                        layers["i"].forgeEquipment()
                        player.i.forge_selected = false
                    } else {
                        player.i.forge_selected = false
                    }
                }
            },
            canClick: () => player.i.forge_unlocked
        },
    },

    grid: {
        rows: 8,
        cols: 8,
        getStartData(id) {
            return Math.floor(id / 100) * 8 + id % 100 - 9
        },
        getUnlocked(id) { 
            return (player.i.inv_slots > getGridData(this.layer, id))
        },
        getCanClick(data, id) {
            return player.i.inventory[data].exist
        },
        getStyle(data, id) {
            return {
                "background-color": "#576574",
                "border-radius": "1px"
            }
        },
        onClick(data, id) {
            let inv = player.i.inventory[data]
            let typ = inv.equiptype
            if (player.i.forge_selected || player.i.discard_selected) {
                if (player.i.selected_inv_ind == data) {
                    player.i.selected_inv_ind = -1
                } else {
                    player.i.selected_inv_ind = data
                }
                return
            }

            if (player.i.equips[typ].equipped) {    
                // swap
                let cur = player.i.equips[typ]
                let t = cur.number; cur.number = inv.number; inv.number = t
                t = cur.name; cur.name = inv.name; inv.name = t

            } else {
                // equip
                player.i.equips[typ].equipped = true
                player.i.equips[typ].number = inv.number
                player.i.equips[typ].name = inv.name
                inv.exist = false

                player.i.cur_invs -= 1
            }
        },
        getTitle(data, id) {
            return player.i.inventory[data].exist ? full_equips[player.i.inventory[data].name].dispn : "Empty"
        },
        getDisplay(data, id) {
            if (player.i.inventory[data].exist) {
                let inv = player.i.inventory[data]
                return `Number <br>${format(inv.number)}`
            } else {
                return ""
            }
        },
    },

    buyables: {
        11: {
            title: "Larger Backpack I",
            unlocked: () => player.mk.mphorde_reward_unlocked,

            display() { return "TODO"},
            style: inventory_buyable_style
            // TODO
        }
    },

    shouldNotify: () => {
        return player.i.cur_invs >= player.i.inv_slots
    },

    tabFormat: {
        "Backpack": {
            content: [
            ["display-text",
            function() {
                let d = player.i
                let disp = ""
                disp += "<p>You have:</p><p>——————————————————————————</p>"
                
                for (let res_n in res_list) {
                    res_n = res_list[res_n]
                    if (d["best"+res_n].gt(0)) {
                        disp += `<p><b>${format(d[res_n])}</b> ${res_name[res_n]}</p>`
                    }
                }
                return disp
            },
            {"font-size": "20px"}],
            "blank",
            "h-line",
            "blank",
            ["display-text", "Equipments"],
            "blank",
            ["clickables", [1]],
            "blank",
            ["clickables", [2]],
            "blank",
            "h-line",
            "blank",
            ["clickables", [3]],
            "blank",
            "grid",
            "blank",
            "buyables",
            "blank"]
        },
        "Forge": {
            content: [    
                ["display-text",
                function() {
                    let d = player.i
                    let disp = ""
                    disp += "<p>You have:</p><p>——————————————————————————</p>"
                    
                    for (let res_n in res_list) {
                        res_n = res_list[res_n]
                        if (d["best"+res_n].gt(0)) {
                            disp += `<p><b>${format(d[res_n])}</b> ${res_name[res_n]}</p>`
                        }
                    }
                    return disp
                },
                {"font-size": "20px"}],
                
                "blank",

                ["display-text", function() {
                    return `<p>You can create equipment here with a number of 1.</p>
                    <p>Having duplicated equipments is not helpful.</p>
                    <p>Rings often provide bonuses outside of combat and are recommended to be made first.</p>`
                }, {"font-size": "16px"}],

                "blank",

                ["layer-proxy", ["mk", ["grid"]]]
            ],
            unlocked: () => player.i.making_unlocked
        }
    },

    doReset(resettingLayer) {
        if (layers[resettingLayer].row > this.row || resettingLayer == "r") {
            let keep = ["inv_slots", "forge_unlocked", "making_unlocked"]
            for (let res_n in res_list) {
                keep.push("best"+res_list[res_n])
            }
            layerDataReset(this.layer, keep)
        }
    },

    
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown() {
        let i = player.i
        return i.bestfish.gt(0) || i.bestfood.gt(0) || i.bestgold.gt(0) || i.bestwood.gt(0)
    },

    update(diff) {
        let d = player.i
        for (let res_n in res_list) {
            res_n = res_list[res_n]
            d["best"+res_n] = d["best"+res_n].max(d[res_n])    
        }
    }
})