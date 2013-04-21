exports.BattleMovedex = {
	"aeroblast": {
		inherit: true,
		defensiveCategory: "Physical",
		desc: "Deals damage to one adjacent target based on its Defense instead of Special Defense. Has a 10% chance to lower the target's Attack by 1 stage.",
		shortDesc: "Damages target based on Defense, not Sp. Def. 10% chance to lower Attack by 1.",
		secondary: {
			chance: 10,
			boosts: {
				atk: -1
			}
		}
	},
	"cometpunch": {
		inherit: true,
		accuracy: 100,
		basePower: 75,
		desc: "Deals damage to one adjacent target. Makes contact. Damage is boosted to 1.2x by the Ability Iron Fist.",
		shortDesc: "No additional effect.",
		type: "Psychic"
	},
	"electroweb": {
		inherit: true,
		accuracy: 85,
		basePower: 70,
		desc: "Deals damage to one adjacent target with a 100% chance to paralyze the target.",
		shortDesc: "100% chance to paralyze the foe.",
		pp: 10,
		secondary: {
			chance: 100,
			status: 'par'
		},
		target: "normal"
	},
	"glaciate": {
		inherit: true,
		accuracy: 90,
		basePower: 100,
		desc: "Deals damage to one adjacent target with a 100% chance to lower its Speed by 2 stages.",
		shortDesc: "100% chance to lower the foe's Speed by 2.",
		pp: 5,
		secondary: {
			chance: 100,
			boosts: {
				spe: -2
			}
		}
	},
	"gust": {
		inherit: true,
		basePower: 20,
		desc: "Deals damage to one adjacent target. If this move is successful and the user has not fainted, the effects of Leech Seed and partial-trapping moves end for the user, and all hazards are removed from the user's side of the field.",
		shortDesc: "Frees user from hazards, partial trap, Leech Seed.",
		self: {
			onHit: function(pokemon) {
				if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
					this.add('-end', pokemon, 'Leech Seed', '[from] move: Gust', '[of] '+pokemon);
				}
				var sideConditions = {spikes:1, toxicspikes:1, stealthrock:1};
				for (var i in sideConditions) {
					if (pokemon.hp && pokemon.side.removeSideCondition(i)) {
						this.add('-sideend', pokemon.side, this.getEffect(i).name, '[from] move: Gust', '[of] '+pokemon);
					}
				}
				if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
					this.add('-remove', pokemon, pokemon.volatiles['partiallytrapped'].sourceEffect.name, '[from] move: Gust', '[of] '+pokemon, '[partiallytrapped]');
					delete pokemon.volatiles['partiallytrapped'];
				}
			}
		},
		target: "normal"
	},
	"heartstamp": {
		inherit: true,
		basePower: 80
	},
	"heatwave": {
		inherit: true,
		basePower: 80,
		desc: "Deals damage to all adjacent foes. For 5 turns, the weather becomes Sunny Day. The power of Fire-type attacks is 1.5x and the power of Water-type attacks is 0.5x during the effect. Lasts for 8 turns if the user is holding Heat Rock.",
		shortDesc: "For 5 turns, intense sunlight powers Fire moves.",
		priority: 0,
		secondary: {
			chance: 100,
			weather: 'sunnyday'
		}
	},
	"howl": {
		inherit: true,
		desc: "Raises the user's Attack by 2 stages.",
		shortDesc: "Boosts the user's Attack by 2.",
		pp: 20,
		boosts: {
			atk: 2
		},
	},
	"icywind": {
		inherit: true,
		accuracy: 90,
		basePower: 80,
		desc: "Deals damage to all adjacent foes. For 5 turns, the weather becomes Hail. At the end of each turn except the last, all active Pokemon lose 1/16 of their maximum HP, rounded down, unless they are an Ice-type, or have the Abilities Ice Body, Magic Guard, Overcoat, or Snow Cloak. Lasts for 8 turns if the user is holding Icy Rock.",
		shortDesc: "For 5 turns, hail crashes down.",
		pp: 10,
		priority: 0,
		secondary: {
			chance: 100,
			weather: 'hail'
		},
	},
	"leechseed": {
		inherit: true,
		accuracy: 100
	},
	"lunardance": {
		num: 461,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Special Attack and Speed by 1 Stage.",
		shortDesc: "Boosts the user's Special Attack and Speed by 1.",
		id: "lunardance",
		isViable: true,
		name: "Lunar Dance",
		pp: 20,
		priority: 0,
		isSnatchable: true,
		boosts: {
			spa: 1,
			spe: 1
		},
		secondary: false,
		target: "self",
		type: "Psychic"
	},
	"lockon": {
		num: 199,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Special Attack and Accuracy by 1 stage.",
		shortDesc: "Boosts the user's Special Attack and Accuracy by 1.",
		id: "lockon",
		name: "Lock-On",
		pp: 15,
		priority: 0,
		isSnatchable: true,
		boosts: {
			spa: 1,
			accuracy: 1
		},
		secondary: false,
		target: "self",
		type: "Normal"
	},
	"magmastorm": {
		inherit: true,
		accuracy: 100,
		basePower: 100,
	},
	"meditate": {
		inherit: true,
		desc: "Raises the user's Attack and Special Defense by 1 stage.",
		shortDesc: "Boosts the user's Attack and Special Defense by 1.",
		pp: 20,
		boosts: {
			atk: 1,
			spd: 1
		},
	},
	"naturepower": {
		num: 267,
		accuracy: 100,
		basePower: 80,
		basePowerCallback: function(pokemon, source) {
			if (source.hasType('Grass')) {
				this.debug('Grass-type boost');
				return 120;
			}
			return 80;
		},
		category: "Physical",
		desc: "Deals damage to all adjacent Pokemon. Base Power increases if the user is a Grass type.",
		shortDesc: "Hits adjacent Pokemon. Power increases if the user is Grass type.",
		id: "naturepower",
		isViable: true,
		name: "Nature Power",
		pp: 15,
		priority: 0,
		secondary: false,
		target: "allAdjacent",
		type: "Ground"
	},
	"needlearm": {
		inherit: true,
		basePower: 40,
		desc: "Deals damage to one adjacent target with a 100% chance to flinch it. Fails unless it is the user's first turn on the field. Makes contact. Priority +4.",
		shortDesc: "Hits first. First turn out only. The target flinches.",
		pp: 10,
		priority: 4,
		onTryHit: function(target, pokemon) {
			if (pokemon.activeTurns > 1) {
				this.debug('It\'s not your first turn out.');
				return false;
			}
		},
		secondary: {
			chance: 100,
			volatileStatus: 'flinch'
		},
	},
	"payday": {
		num: 6,
		accuracy: 100,
		basePower: 20,
		category: "Physical",
		desc: "Deals damage to one adjacent target and hits twice. If the first hit breaks the target's Substitute, it will take damage for the second hit. This move is always a critical hit unless the target is under the effect of Lucky Chant or has the Abilities Battle Armor or Shell Armor.",
		shortDesc: "Hits 2 times in one turn. Always results in a critical hit.",
		id: "payday",
		name: "Pay Day",
		pp: 10,
		priority: 0,
		miltihit: 2,
		willCrit: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"peck": {
		inherit: true,
		basePower: 40,
		category: "Physical",
		desc: "Deals damage to one adjacent or non-adjacent target. Makes contact. This move is always a critical hit unless the target is under the effect of Lucky Chant or has the Abilities Battle Armor or Shell Armor.",
		shortDesc: "Always results in a critical hit.",
		pp: 10,
		willCrit: true
	},
	"psychocut": {
		inherit: true,
		basePower: 50,
		category: "Physical",
		desc: "Deals damage to one adjacent target. This move is always a critical hit unless the target is under the effect of Lucky Chant or has the Abilities Battle Armor or Shell Armor.",
		shortDesc: "Always results in a critical hit.",
		pp: 10,
		willCrit: true
	},
	"razorshell": {
		num: 534,
		accuracy: 85,
		basePower: 100,
		category: "Physical",
		desc: "Deals damage to one adjacent target with a 20% chance to flinch it. Makes contact.",
		shortDesc: "20% chance to flinch the target.",
		secondary: {
			chance: 20,
			volatileStatus: 'flinch'
		},
	},
	"razorwind": {
		num: 13,
		accuracy: 100,
		basePower: 30,
		category: "Special",
		desc: "Deals damage to one adjacent target and hits twice with a higher chance for a critical hit. If the first hit breaks the target's Substitute, it will take damage for the second hit.",
		shortDesc: "Hits 2 times in one turn. High crit ratio.",
		id: "razorwind",
		name: "Razor Wind",
		pp: 10,
		priority: 0,
		multihit: 2,
		critRatio: 2,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"relicsong": {
		inherit: true,
		desc: "Deals damage to all adjacent foes with a 20% chance to raise Attack and Special Attack by 1 stage. If this move is successful on at least one foe and the user is a Meloetta, it changes to the Pirouette Forme if it is currently in Aria Forme, or changes to Aria Forme if it is currently in Pirouette Forme. The Pirouette Forme reverts to Aria Forme when Meloetta is not active. Pokemon with the Ability Soundproof are immune.",
		shortDesc: "20% chance to boost Attack and Special Attack by 1. Meloetta transforms.",
		secondary: {
			chance: 20,
			self: {
				boosts: {
					atk: 1,
					spa: 1
				}
			}
		},
	},
	"roaroftime": {
		num: 459,
		accuracy: 90,
		basePower: 120,
		category: "Special",
		desc: "Deals damage to one adjacent target with a 50% chance to either confuse, burn, paralyze, poison, or freeze it.",
		shortDesc: "50% chance to confuse or burn or paralyze or poison or freeze target.",
		id: "roaroftime",
		name: "Roar of Time",
		pp: 5,
		priority: 0,
		secondary: {
			chance: 50,
			onHit: function(target, source) {
				var result = this.random(5);
				if (result===0) {
					target.addVolatile('confusion', source);
				} else if (result===1) {
					target.trySetStatus('brn', source);
				} else if (result===2) {
					target.trySetStatus('par', source);
				} else if (result===3) {
					target.trySetStatus('psn', source);
				} else {
					target.trySetStatus('frz', source);
				}
			}
		},
		target: "normal",
		type: "Dragon"
	},
	"rocksmash": {
		inherit: true,
		desc: "Deals damage to one adjacent target. Makes contact. This move is always a critical hit unless the target is under the effect of Lucky Chant or has the Abilities Battle Armor or Shell Armor.",
		shortDesc: "Always results in a critical hit.",
		pp: 10,
		willCrit: true,
		secondary: false,
	},
	"rocktomb": {
		inherit: true,
		accuracy: 95,
		basePower: 60,
	},
	"sacredsword": {
		inherit: true,
		desc: "Deals damage to one adjacent target and ignores the target's stat stage changes, including evasion, with a 10% to raise Attack by 1 Stage. Makes contact.",
		shortDesc: "Ignores the target's stat stage changes. 10% chance to boost Attack by 1.",
		secondary: {
			chance: 10,
			self: {
				boosts: {
					atk: 1
				}
			}
		},
	},
	"sandattack": {
		num: 28,
		accuracy: 90,
		basePower: 80,
		category: "Physical",
		desc: "Deals damage to all adjacent foes. For 5 turns, the weather becomes Sandstorm. At the end of each turn except the last, all active Pokemon lose 1/16 of their maximum HP, rounded down, unless they are a Ground, Rock, or Steel-type, or have the Abilities Magic Guard, Overcoat, Sand Force, Sand Rush, or Sand Veil. The Special Defense of Rock-types is 1.5x during the effect. Lasts for 8 turns if the user is holding Smooth Rock.",
		shortDesc: "For 5 turns, a sandstorm rages.",
		id: "sandattack",
		name: "Sand-Attack",
		pp: 10,
		priority: 0,
		secondary: {
			chance: 100,
			weather: 'Sandstorm'
		},
		target: "allAdjacentFoes",
		type: "Ground"
	},
	"shadowclaw": {
		inherit: true,
		basePower: 80
	},
        "shellsmash": {
                inherit: true,
                boosts: {
                        atk: 2,
                        spa: 2,
                        spe: 2,
                        def: -1,
                        spd: -1
                },
                onModifyMove: function(move, user) {
                        if (user.ability === 'shellarmor') {
                                move.boosts = {
                                        spa: 1,
                                        atk: 1,
                                        spe: 1,
                                };
                        }
                }
	},	
	"skyattack": {
		num: 143,
		accuracy: 90,
		basePower: 100,
		category: "Physical",
		desc: "Deals damage to one adjacent or non-adjacent target with a 20% chance to lower its Defense by 1 stage. Has a higher chance for a critical hit.",
		shortDesc: "20% chance to lower target's Defense by 1. High crit.",
		id: "skyattack",
		name: "Sky Attack",
		pp: 10,
		priority: 0,
		secondary: {
			chance: 20,
			boosts: {
				def: -1
			}
		},
		target: "any",
		type: "Flying"
	},
	"soak": {
		num: 487,
		accuracy: 90,
		basePower: 80,
		category: "Status",
		desc: "Deals damage to all adjacent foes. For 5 turns, the weather becomes Rain Dance. The power of Water-type attacks is 1.5x and the power of Fire-type attacks is 0.5x during the effect. Lasts for 8 turns if the user is holding Damp Rock.",
		shortDesc: "For 5 turns, heavy rain powers Water moves.",
		id: "soak",
		name: "Soak",
		pp: 10,
		priority: 0,
		secondary: {
			chance: 100,
			weather: 'RainDance'
		},
		target: "allAdjacentFoes",
		type: "Water"
	},
	"spikecannon": {
		num: 131,
		accuracy: 100,
		basePower: 20,
		category: "Physical",
		desc: "Deals damage to one adjacent target. Sets up a hazard on the foe's side of the field, damaging each foe that switches in, unless it is a Flying-type or has the Ability Levitate. Can be used up to three times before failing. Foes lose 1/8 of their maximum HP with one layer, 1/6 of their maximum HP with two layers, and 1/4 of their maximum HP with three layers, all rounded down. Can be removed from the foe's side if any foe uses Rapid Spin or is hit by Defog.",
		shortDesc: "Hurts grounded foes on switch-in. Max 3 layers.",
		id: "spikecannon",
		name: "Spike Cannon",
		pp: 20,
		priority: 0,
		sideCondition: 'spikes',
		effect: {
			// this is a side condition
			onStart: function(side) {
				this.add('-sidestart', side, 'Spikes');
				this.effectData.layers = 1;
			},
			onRestart: function(side) {
				if (this.effectData.layers < 3) {
					this.add('-sidestart', side, 'Spikes');
					this.effectData.layers++;
				}
			},
			onSwitchIn: function(pokemon) {
				var side = pokemon.side;
				if (!pokemon.runImmunity('Ground')) return;
				var damageAmounts = [0,3,4,6]; // 1/8, 1/6, 1/4
				var damage = this.damage(damageAmounts[this.effectData.layers]*pokemon.maxhp/24);
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal"
	},
	"stealthrock": {
		inherit: true,
		desc: "Sets up a hazard on the foe's side of the field, damaging each foe that switches in. Can be used only once before failing. Foes lose 1/32, 1/16, 1/8, or 1/4 of their maximum HP, rounded down, based on their weakness to the Rock-type; 0.25x, 0.5x, neutral, or 2x or greater, respectively. Can be removed from the foe's side if any foe uses Rapid Spin or is hit by Defog. Pokemon protected by Magic Coat or the Ability Magic Bounce are unaffected and instead use this move themselves. (CAP: Pokemon with the Ability Mountaineer are immune.)",
		effect: {
			// this is a side condition
			onStart: function(side) {
				this.add('-sidestart',side,'move: Stealth Rock');
			},
			onSwitchIn: function(pokemon) {
				var typeMod = this.getEffectiveness('Rock', pokemon);
				var factor = 8;
				if (typeMod >= 1) factor = 4;
				if (typeMod == -1) factor = 16;
				if (typeMod <= -2) factor = 32;
				var damage = this.damage(pokemon.maxhp/factor);
			}
		}
	},
	"triattack": {
		inherit: true,
		basePower: 25,
		desc: "Deals damage to one adjacent target and hits three times with a 20% chance to either burn, freeze, paralyze, or poison it. If the first hit breaks the target's Substitute, it will take damage for the second hit, etc.",
		shortDesc: "Hits 3 times in one turn. 20% chance to paralyze or burn or freeze or poison target.",
		multihit: 3,
		secondary: {
			chance: 20,
			onHit: function(target, source) {
				var result = this.random(4);
				if (result===0) {
					target.trySetStatus('brn', source);
				} else if (result===1) {
					target.trySetStatus('par', source);
				} else if (result===2) {
					target.trySetStatus('frz', source);
				} else {
					target.trySetStatus('psn', source);
				}
			}
		},
	},
	"twister": {
		inherit: true,
		basePower: 80,
		pp: 15,
		type: "Flying"
	}
}
