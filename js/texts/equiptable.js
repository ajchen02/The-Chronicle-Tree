// Contains all equipments, including craft cost and effects.

var full_equip_list = [
    "sword0", "bow0", "dagger0", "shield0", "armor0", "cloth", "grassring",
    "fishingrod0", "axe0", "pickaxe0", "goldenring", "foodring", "compositebow",
    "scaleshield", "bonering"
]


// desc: has 2 params, number = sqrt(player number * equip number), inv_number = equip number
// effect, applyEffect: param = equip number
var full_equips = {
    // fishingrod
    "fishingrod0": {
        dispn: "Fishing rod",
        etype: "fishingrod",
        cost: {
            wood: d(20),
            fiber: d(30)
        },
        unlocked: () => true
    },

    // axe
    "axe0": {
        dispn: "Iron axe",
        etype: "axe",
        cost: {
            wood: d(10),
            mineral: d(5)
        },
        unlocked: () => true
    },

    // pickaxe
    "pickaxe0": {
        dispn: "Iron pickaxe",
        etype: "pickaxe", 
        cost: {
            wood: d(10),
            mineral: d(10)
        },
        unlocked: () => true
    },

    // weapon
    "sword0": {
        dispn: "Iron sword", 
        etype: "weapon",
        cost: {
            mineral: d(5)
        },
        atk: d(10),
        desc: (number) => `ATK ${format(number.mul(10))}`,
        unlocked: () => true
    },
    
    "bow0": {
        dispn: "Long bow",
        etype: "weapon",
        cost: {
            wood: d(40),
            fiber: d(20)
        },
        atk: d(18),
        desc: (number) => `ATK ${format(number.mul(18))}
            SPD x0.9
            Pre-Action 50%`,
        applyEffect: () => {
            player.b.pl.speed = player.b.pl.speed.mul(0.9)
            player.b.pl_action = tmp.b.fullActionBar.mul(0.5)
        },
        unlocked: () => true
    },
    
    "dagger0": {
        dispn: "Dagger",
        etype: "weapon",
        cost: {
            wood: d(10),
            mineral: d(3)
        },
        atk: d(8),
        desc: (number) => `ATK ${format(number.mul(8))}
            SPD x1.2
            Apply bleeding`,
        applyEffect: () => {
            player.b.pl.speed = player.b.pl.speed.mul(1.2)
            player.b.pl.traits["induce_bleeding"] = undefined
        },

        unlocked: () => true
    },

    // shield
    "shield0": {
        dispn: "Iron shield",
        etype: "shield",
        cost: {
            mineral: d(8)
        },
        def: d(3),
        desc: (number) => `DEF ${format(number.mul(3))}`,
        unlocked: () => true
    },

    // armor
    "armor0": {
        dispn: "Iron armor",
        etype: "armor",
        cost: {
            mineral: d(10)
        },
        def: d(3),
        desc: (number) => `DEF ${format(number.mul(3))}`,
        unlocked: () => true
    },
    
    "cloth": {
        dispn: "Soft armor",
        etype: "armor",
        cost: {
            fiber: d(10),
            fur: d(40)
        },
        def: d(1),
        desc: (number) => `DEF ${format(number.mul(1))}
            SPD x1.2`,
        applyEffect: () => {
            player.b.pl.speed = player.b.pl.speed.mul(1.2)
        },
        unlocked: () => true
    },

    // ring
    "grassring": {
        dispn: "Grass ring",
        etype: "ring",
        cost: {
            fiber: d(10)
        },
        desc: (number, inv_number) => `幂次原野投入时间 x${format(inv_number.add(8).log(5))}`,
        effect: (number) => number.add(5).log(5),
        unlocked: () => true
    },

    "goldenring": {
        dispn: "黄金戒指",
        etype: "ring",
        cost: {
            gold: d(200)
        },
        desc: (number, inv_number) => `战斗奖励 x${format(inv_number.add(8).log(5))}`,
        effect: (number) => number.add(5).log(5),
        unlocked: () => player.mk.mpcave_reward_unlocked
    },

    "foodring": {
        dispn: "储备粮戒指",
        etype: "ring",
        cost: {
            food: d(200)
        },
        desc: (number, inv_number) => `最大HP x${format(inv_number.add(3).log(3))}`,
        applyEffect: (number) => {
            player.b.pl.maxhp = player.b.pl.maxhp.mul(number.add(3).log(3))
            player.b.pl.hp = player.b.pl.maxhp
        },
        unlocked: () => player.mk.mpcave_reward_unlocked
    },

    "compositebow": {
        dispn: "复合弓",
        etype: "weapon",
        cost: {
            wood: d(50),
            fiber: d(40),
            mineral: d(15),
        },
        atk: d(25),
        
        desc: (number) => `ATK ${format(number.mul(18))}
            暴击率+20%
            速度x0.5
            预行动90%`,
        applyEffect: () => {
            player.b.pl.crit = player.b.pl.crit.add(0.2)
            player.b.pl_action = tmp.b.fullActionBar.mul(0.9)
            player.b.pl.speed = player.b.pl.speed.mul(0.5)
        },
        unlocked: () => player.mk.compositebow_unlocked,
    },

    "scaleshield": {
        dispn: "兽鳞盾",
        etype: "shield",
        cost: {
            scale: d(10),
        },
        def: d(2.5),
        desc: (number, inv_number) => {
            let eff = inv_number.add(100).log(100).sub(1)
            eff = eff.mul(0.2).add(1).div((eff.add(1)))
            return `DEF ${format(number.mul(2.5))}
                对自身施加坚韧，受到伤害 x${format(eff)}`
        },
        applyEffect: (number) => {
            let eff = number.add(100).log(100).sub(1)
            eff = eff.mul(0.2).add(1).div((eff.add(1)))
            player.b.pl.buffs["tough"] = { rate: eff }
        },
        unlocked: () => player.mk.mphorde_reward_unlocked
    },

    "bonering": {
        dispn: "骨戒",
        etype: "ring",
        cost: {
            bones: d(30)
        },
        desc: (number, inv_number) => `狩猎期望时间 x${format(d(2).div(inv_number.div(100).add(5).log(5).add(2)))}`,
        effect: (number) => d(2).div(number.div(100).add(5).log(5).add(2)),
        unlocked: () => player.mk.mphorde_reward_unlocked
    }
}