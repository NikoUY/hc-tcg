import {getHasRedirectingCards, getNonEmptyRows} from '../../../../server/utils'
import {GameModel} from '../../../../server/models/game-model'
import SingleUseCard from './_single-use-card'

/**
 * @typedef {import('common/types/cards').CardPos} CardPos
 * @typedef {import('common/types/pick-process').PickRequirmentT} PickRequirmentT
 */

class TargetBlockSingleUseCard extends SingleUseCard {
	constructor() {
		super({
			id: 'target_block',
			name: 'Target Block',
			rarity: 'rare',
			description:
				"Choose one of your opponent's AFK Hermits to take all damage done during this turn.",
			pickOn: 'attack',
			pickReqs: /** @satisfies {Array<PickRequirmentT>} */ ([
				{target: 'opponent', type: ['hermit'], amount: 1, active: false},
			]),
		})
	}

	getIsRedirecting() {
		return true
	}

	canApply() {
		return true
	}

	/**
	 * @param {GameModel} game
	 * @param {string} instance
	 * @param {CardPos} pos
	 */
	onApply(game, instance, pos) {
		const {player, row, rowIndex} = pos

		player.hooks.beforeAttack[instance] = (attack, pickedSlots) => {
			if (!row || rowIndex === null || !row.hermitCard) return
			attack.target.index = rowIndex
			attack.target.row = row
		}
	}

	/**
	 * @param {GameModel} game
	 * @param {CardPos} pos
	 */
	canAttach(game, pos) {
		console.log('test')
		if (super.canAttach(game, pos) === 'INVALID') return 'INVALID'
		console.log('test2')
		const {otherPlayer} = pos

		console.log('test3')
		// Inactive Hermits
		if (getNonEmptyRows(otherPlayer, false).length === 0) return 'NO'
		console.log('test4')
		// Can be used if a Lighning Rod is active
		if (getHasRedirectingCards(otherPlayer)) return 'NO'
		console.log('test5')

		return 'YES'
	}

	/**
	 * @param {GameModel} game
	 * @param {string} instance
	 * @param {CardPos} pos
	 */
	onDetach(game, instance, pos) {
		const {player} = pos
		delete player.hooks.beforeAttack[instance]
	}
}

export default TargetBlockSingleUseCard
