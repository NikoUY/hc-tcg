import {AttackModel} from '../../../../server/models/attack-model'
import {GameModel} from '../../../../server/models/game-model'
import {CardPos} from '../../../../server/models/card-pos-model'
import Card from '../_card'

/**
 * @typedef {import('../../../types/cards').SingleUseDefs} SingleUseDefs
 * @typedef {import('../../../types/pick-process').PickedSlots} PickedSlots
 */

class SingleUseCard extends Card {
	/**
	 * @param {SingleUseDefs} defs
	 */
	constructor(defs) {
		super({
			type: 'single_use',
			id: defs.id,
			name: defs.name,
			rarity: defs.rarity,
			pickOn: defs.pickOn,
			pickReqs: defs.pickReqs,
		})

		if (!defs.description) {
			throw new Error('Invalid card definition')
		}
		/** @type {string} */
		this.description = defs.description
	}

	/**
	 * @param {GameModel} game
	 * @param {CardPos} pos
	 * @returns {"YES" | "NO" | "INVALID"}
	 */
	canAttach(game, pos) {
		if (!pos.slot || pos.slot.type !== 'single_use') return 'INVALID'

		return 'YES'
	}

	/**
	 * Returns whether this card has apply functionality or not
	 * @returns {boolean}
	 */
	canApply() {
		// default is no
		return false
	}
}

export default SingleUseCard
