import HermitCard from './_hermit-card'
import {GameModel} from '../../../../server/models/game-model'
import {AttackModel} from '../../../../server/models/attack-model'
import {flipCoin} from '../../../../server/utils'

/**
 * @typedef {import('common/types/cards').CardPos} CardPos
 * @typedef {import('common/types/attack').HermitAttackType} HermitAttackType
 * @typedef {import('common/types/pick-process').PickedSlots} PickedSlots
 */

class GoatfatherRareHermitCard extends HermitCard {
	constructor() {
		super({
			id: 'goatfather_rare',
			name: 'Goatfather',
			rarity: 'rare',
			hermitType: 'prankster',
			health: 270,
			primary: {
				name: 'Omerta',
				cost: ['any'],
				damage: 40,
				power: null,
			},
			secondary: {
				name: 'Anvil Drop',
				cost: ['prankster', 'prankster'],
				damage: 80,
				power:
					"Flip a coin. If heads, do an additional 30hp damage to your opponent's active Hermit and 10hp damage to each Hermit directly below it.",
			},
		})
	}

	/**
	 * @param {GameModel} game
	 * @param {string} instance
	 * @param {CardPos} pos
	 * @param {HermitAttackType} hermitAttackType
	 * @param {PickedSlots} pickedSlots
	 */
	getAttacks(game, instance, pos, hermitAttackType, pickedSlots) {
		const attacks = super.getAttacks(
			game,
			instance,
			pos,
			hermitAttackType,
			pickedSlots
		)

		const {player, otherPlayer, row, rowIndex} = pos

		if (attacks[0].type !== 'secondary') return attacks

		const coinFlip = flipCoin(player)
		player.coinFlips[this.id] = coinFlip

		if (coinFlip[0] === 'tails') return attacks

		// Add 30 damage to the active hermit
		attacks[0].addDamage(30)

		const activeRow = otherPlayer.board.activeRow
		const rows = otherPlayer.board.rows
		if (!activeRow || !rowIndex || !row || !row.hermitCard) return attacks
		const targetIndexes = []
		for (let i = activeRow + 1; i < rows.length; i++) {
			if (!rows[i].hermitCard) continue
			targetIndexes.push(i)
		}

		// Create attacks for the hermits below the active hermit
		for (const targetIndex of targetIndexes) {
			const targetRow = rows[targetIndex]
			if (!targetRow.hermitCard) continue

			const attack = new AttackModel({
				id: this.getInstanceKey(instance),
				attacker: {
					index: rowIndex,
					row: row,
				},
				target: {
					index: targetIndex,
					row: targetRow,
				},
				type: hermitAttackType,
			})

			attack.addDamage(10)
			attacks.push(attack)
		}

		return attacks
	}

	getExpansion() {
		return 'alter_egos'
	}

	getPalette() {
		return 'alter_egos'
	}

	getBackground() {
		return 'alter_egos_background'
	}
}

export default GoatfatherRareHermitCard
