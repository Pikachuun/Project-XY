/*

Ratings and how they work:

-2: Extremely detrimental
	  The sort of ability that relegates Pokemon with Uber-level BSTs
	  into NU.
	ex. Slow Start, Truant

-1: Detrimental
	  An ability that does more harm than good.
	ex. Defeatist, Klutz

 0: Useless
	  An ability with no net effect on a Pokemon during a battle.
	ex. Pickup, Illuminate

 1: Ineffective
	  An ability that has a minimal effect. Should never be chosen over
	  any other ability.
	ex. Pressure, Damp

 2: Situationally useful
	  An ability that can be useful in certain situations.
	ex. Blaze, Insomnia

 3: Useful
	  An ability that is generally useful.
	ex. Volt Absorb, Iron Fist

 4: Very useful
	  One of the most popular abilities. The difference between 3 and 4
	  can be ambiguous.
	ex. Technician, Intimidate

 5: Essential
	  The sort of ability that defines metagames.
	ex. Drizzle, Magnet Pull

*/

exports.BattleAbilities = {
	"cloudnine": {
		desc: "While this Pokemon is active, all weather conditions disappear.",
		shortDesc: "While this Pokemon is active, all weather conditions disappear.",
		onStart: function(source) {
			this.setWeather('');
		},
		id: "cloudnine",
		name: "Cloud Nine",
		rating: 5,
		num: 13
	},
	"flareboost": {
		desc: "If this Pokemon becomes burned, it will recover one-eighth of its max HP after each turn.",
		shortDesc: "This Pokemon is healed by 1/8 of its max HP each turn when burned; no HP loss.",
		onDamage: function(damage, target, source, effect) {
			if (effect.id === 'brn') {
				this.heal(target.maxhp/8);
				return false;
			}
		},
		id: "flareboost",
		name: "Flare Boost",
		rating: 4,
		num: 138
	},
	"forecast": {
		inherit: true,
		onModifyMove: function(move) {
			if (move.weather) {
				var weather = move.weather;
				move.weather = null;
				move.onHit = function(target, source) {
					this.setWeather(weather, source, this.getAbility('forecast'));
					this.weatherData.duration = 0;
				};
				move.target = 'self';
			}
		}
	},
	"healer": {
		desc: "Heals one-sixteenth of this Pokemon's max HP after every turn.",
		shortDesc: "This Pokemon is healed by 1/16 of its max HP each turn..",
		id: "healer",
		name: "Healer",
		onResidualOrder: 5,
		onResidualSubOrder: 1,
		onResidual: function(pokemon) {
			this.heal(pokemon.maxhp/16);
		},
		rating: 0,
		num: 131
	},
	"illuminate": {
		desc: "The accuracy of this Pokemon's moves receives a 10% increase; for example, a 75% accurate move  becomes 82.5% accuracte. This Pokemon ignores the opponent's evasion modifiers.",
		shortDesc: "This Pokemon's moves have their accuracy boosted to 1.1x. This Pokemon ignores the opponent's evasion.",
		id: "illuminate",
		name: "Illuminate",
		onModifyMove: function(move, user, target) {
			move.ignoreEvasion = true;
			if (typeof move.accuracy !== 'number') return;
			this.debug('illuminate - enhancing accuracy');
			move.accuracy *= 1.1;
		},
		rating: 0,
		num: 35
	},
	"leafguard": {
		desc: "If this Pokemon is active while Sunny Day is in effect, it takes two-thirds damage from all attacks.",
		shortDesc: "If Sunny Day is active, this Pokemon recieves 2/3 damage from attacks.",
		onSourceBasePower: function(basePower, attacker, defender, move) {
			if (this.isWeather('sunnyday')) {
				this.debug('Leaf Guard neutralize')
				return basePower * 2/3;
			}
		},
		id: "leafguard",
		name: "Leaf Guard",
		rating: 3,
		num: 102
	},
	"mummy": {
		desc: "If this Pokemon is not a Ghost type, it will take one-sixteenth of its max HP as damage after every turn. When the user is attacked by a contact move, the opposing Pokemon's ability is turned into Mummy as well. Multitype, Wonder Guard and Mummy itself are the only abilities not affected by Mummy. The effect of Mummy is not removed by Mold Breaker, Turboblaze, or Teravolt.",
		shortDesc: "Non-Ghost type Pokemon take 1/16 of their max HP in damage every turn. Pokemon making contact with this Pokemon have their Ability changed to Mummy.",
		id: "mummy",
		name: "Mummy",
		onResidualOrder: 5,
		onResidualSubOrder: 2,
		onResidual: function(pokemon) {
			if (pokemon.hasType('Ghost')) {
				return;
			} else {
				this.damage(pokemon.maxhp/16);
			}
		},
		onAfterDamage: function(damage, target, source, move) {
			if (source && source !== target && move && move.isContact) {
				if (source.setAbility('mummy')) {
					this.add('-ability', source, 'Mummy', '[from] Mummy');
				}
			}
		},
		rating: 1,
		num: 152
	},
	"oblivious": {
		desc: "Opponents cannot reduce this Pokemon's stats; they can, however, modify stat changes with Power Swap, Guard Swap and Heart Swap and inflict stat boosts with Swagger and Flatter. This ability does not prevent self-inflicted stat reductions.",
		shortDesc: "Prevents other Pokemon from lowering this Pokemon's stat stages.",
		onBoost: function(boost, target, source) {
			if (source && target === source) return;
			for (var i in boost) {
				if (boost[i] < 0) {
					delete boost[i];
					this.add("-message", target.name+"'s stats were not lowered! (placeholder)");
				}
			}
		},
		id: "oblivious",
		name: "Oblivious",
		rating: 2,
		num: 12
	},
	"sandveil": {
		desc: "If this Pokemon is active while Sandstorm is in effect, it takes two-thirds damage from all attacks; if this Pokemon has a typing that would normally take damage from Sandstorm, this Pokemon is also immune to Sandstorm's damage.",
		shortDesc: "If Sandstorm is active, this Pokemon recieves 2/3 damage from attacks; immunity to Sandstorm.",
		onImmunity: function(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		onSourceBasePower: function(basePower, attacker, defender, move) {
			if (this.isWeather('sandstorm')) {
				this.debug('Sand Veil neutralize')
				return basePower * 2/3;
			}
		},
		id: "sandveil",
		name: "Sand Veil",
		rating: 3,
		num: 8
	},
	"scrappy": {
		desc: "This Pokemon has the ability to bypass all type immunities. Effectiveness of these moves takes into account the Pokemon's other weaknesses and resistances.",
		shortDesc: "This Pokemon can bypass all type immunities.",
		onFoeModifyPokemon: function(pokemon) {
			if (pokemon.hasType('Ghost')) {
				pokemon.negateImmunity['Normal'] = true;
				pokemon.negateImmunity['Fighting'] = true;
			} else if (pokemon.hasType('Normal')) {
				pokemon.negateImmunity['Ghost'] = true;
			} else if (pokemon.hasType('Flying')) {
				pokemon.negateImmunity['Ground'] = true;
			} else if (pokemon.hasType('Ground')) {
				pokemon.negateImmunity['Electric'] = true;
			} else if (pokemon.hasType('Steel')) {
				pokemon.negateImmunity['Poison'] = true;
			}
		},
		id: "scrappy",
		name: "Scrappy",
		rating: 3,
		num: 113
	},
	"snowcloak": {
		desc: "If this Pokemon is active while Hail is in effect, it takes two-thirds damage from all attacks; if this Pokemon has a typing that would normally take damage from Hail, this Pokemon is also immune to Hail's damage.",
		shortDesc: "If Hail is active, this Pokemon recieves 2/3 damage from attacks; immunity to Hail.",
		onImmunity: function(type, pokemon) {
			if (type === 'hail') return false;
		},
		onSourceBasePower: function(basePower, attacker, defender, move) {
			if (this.isWeather('hail')) {
				this.debug('Snow Cloak neutralize')
				return basePower * 2/3;
			}
		},
		id: "snowcloak",
		name: "Snow Cloak",
		rating: 3,
		num: 81
	},
	"stall": {
		desc: "This Pokemon takes half damage from all attacks, but all of its attacks have -7 priority.",
		shortDesc: "This Pokemon moves last among Pokemon; 1/2 damage from attacks.",
		onSourceBasePower: function(basePower, attacker, defender, move) {
			this.debug('Stall neutralize')
			return basePower * 1/2;
		},
		onModifyPriority: function(priority) {
			this.debug('Stall - Setting priority to -7');
			return -7;
		},
		id: "stall",
		name: "Stall",
		rating: -1,
		num: 100
	},
	"teravolt": {
		desc: "When this Pokemon becomes active, it nullifies the abilities of opposing active Pokemon that hinder this Pokemon's attacks. These abilities include Battle Armor, Clear Body, Damp, Dry Skin, Filter, Flash Fire, Flower Gift, Heatproof, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Lightningrod, Limber, Magma Armor, Marvel Scale, Motor Drive, Oblivious, Own Tempo, Sand Veil, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Tangled Feet, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Veil, White Smoke and Wonder Guard. This Pokemon is immune to all Electric-type attacks, including Thunder Wave, and if an Electric-type attack hits this Pokemon, it receives a one-level Attack boost.",
		shortDesc: "This Pokemon's moves ignore the target's Ability if it could modify the effectiveness. This Pokemon's Attack is boosted by 1 if hit by an Electric move; Electric immunity.",
		onStart: function(pokemon) {
			this.add('-ability', pokemon, 'Teravolt');
		},
		onAllyModifyPokemon: function(pokemon) {
			if (this.activePokemon === this.effectData.target && pokemon !== this.activePokemon) {
				pokemon.ignore['Ability'] = 'A';
			}
		},
		onFoeModifyPokemon: function(pokemon) {
			if (this.activePokemon === this.effectData.target) {
				pokemon.ignore['Ability'] = 'A';
			}
		},
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Electric') {
				this.boost({atk:1});
				return null;
			}
		},
		id: "teravolt",
		name: "Teravolt",
		rating: 4,
		num: 164
	},
	"truant": {
		desc: "After this Pokemon is switched into battle, it skips every other turn.",
		shortDesc: "This Pokemon skips every other turn instead of using a move.",
		onBeforeMove: function(pokemon, target, move) {
			if (pokemon.removeVolatile('truant')) {
				this.add('cant',pokemon,'ability: Truant', move);
				return false;
			}
			pokemon.addVolatile('truant');
		},
		effect: {
			duration: 2
		},
		onSourceBasePower: function(basePower, attacker, defender, move) {
			this.debug('Truant neutralize')
			return basePower * 1/2;
		},

		id: "truant",
		name: "Truant",
		rating: -1,
		num: 54
	},
	"turboblaze": {
		desc: "When this Pokemon becomes active, it nullifies the abilities of opposing active Pokemon that hinder this Pokemon's attacks. These abilities include Battle Armor, Clear Body, Damp, Dry Skin, Filter, Flash Fire, Flower Gift, Heatproof, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Lightningrod, Limber, Magma Armor, Marvel Scale, Motor Drive, Oblivious, Own Tempo, Sand Veil, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Tangled Feet, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Veil, White Smoke and Wonder Guard. This Pokemon is immune to all Fire-type attacks, and if a Fire-type attack hits this Pokemon, it receives a one-level Speed boost.",
		shortDesc: "This Pokemon's moves ignore the target's Ability if it could modify the effectiveness. This Pokemon's Speed is boosted by 1 if hit by a Fire move; Fire immunity.",
		onStart: function(pokemon) {
			this.add('-ability', pokemon, 'Turboblaze');
		},
		onAllyModifyPokemon: function(pokemon) {
			if (this.activePokemon === this.effectData.target && pokemon !== this.activePokemon) {
				pokemon.ignore['Ability'] = 'A';
			}
		},
		onFoeModifyPokemon: function(pokemon) {
			if (this.activePokemon === this.effectData.target) {
				pokemon.ignore['Ability'] = 'A';
			}
		},
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Fire') {
				this.boost({spe:1});
				return null;
			}
		},
		id: "turboblaze",
		name: "Turboblaze",
		rating: 4,
		num: 163
	},
	"wonderskin": {
		desc: "If this Pokemon is active, it cannot become poisoned, burned, paralyzed or put to sleep (other than user-induced Rest). Leaf Guard does not heal status effects that existed before this Pokemon was active.",
		shortDesc: "This Pokemon cannot be statused and Rest will fail for it.",
		onSetStatus: function(pokemon) {
			return false;
		},
		onTryHit: function(target, source, move) {
			if (move && move.id === 'yawn') {
				return false;
			}
		},
		id: "wonderskin",
		name: "Wonder Skin",
		rating: 1,
		num: 147
	}
};
