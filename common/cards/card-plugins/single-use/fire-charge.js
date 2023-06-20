import {
	discardCard,
	discardSingleUse,
	rowHasItem,
	isRemovable,
} from '../../../../server/utils'
import SingleUseCard from './_single-use-card'
import {GameModel} from '../../../../server/models/game-model'

/**
 * @typedef {import('common/types/pick-process').PickedSlots} PickedSlots
 * @typedef {import('common/types/cards').CardPos} CardPos
 */

class FireChargeSingleUseCard extends SingleUseCard {
	constructor() {
		super({
			id: 'fire_charge',
			name: 'Fire Charge',
			rarity: 'common',
			description:
				'Discard 1 attached item or effect card from your active or AFK Hermit.\n\nYou can use another single use effect card this turn.',

			pickOn: 'apply',
			pickReqs: [{target: 'player', type: ['item', 'effect'], amount: 1}],
		})
	}

	/**
	 * @param {GameModel} game
	 * @param {string} instance
	 * @param {CardPos} pos
	 * @param {PickedSlots} pickedSlots
	 */
	onApply(game, instance, pos, pickedSlots) {
		const slots = pickedSlots[this.id] || []
		const {player} = pos

		if (slots.length !== 1) return

		const pickedCard = slots[0]
		if (pickedCard.slot.card === null) return

		discardCard(game, pickedCard.slot.card)

		player.custom[this.getInstanceKey(instance, 'checkUsed')] = true
		player.custom[this.getInstanceKey(instance, 'discard')] = true
	}

	/**
	 * @param {GameModel} game
	 * @param {CardPos} pos
	 * @returns {"YES" | "NO" | "INVALID"}
	 */
	canAttach(game, pos) {
		if (super.canAttach(game, pos) === 'INVALID') return 'INVALID'
		const {player} = pos

		for (const row of player.board.rows) {
			if (
				(row.effectCard !== null && isRemovable(row.effectCard)) ||
				rowHasItem(row)
			)
				return 'YES'
		}

		return 'NO'
	}

	/**
	 * @param {GameModel} game
	 * @param {string} instance
	 * @param {CardPos} pos
	 */
	onAttach(game, instance, pos) {
		const {player} = pos

		const checkKey = this.getInstanceKey(instance, 'checkUsed')
		const discardKey = this.getInstanceKey(instance, 'discard')

		player.hooks.availableActions[instance] = (availableActions) => {
			// We have to check if PLAY_SINGLE_USE_CARD is already there because it's possible that another card added it
			// e.g. if you play a card that allows you to play another single use card like multiple Pistons back to back
			if (!availableActions.includes('PLAY_SINGLE_USE_CARD')) {
				availableActions.push('PLAY_SINGLE_USE_CARD')
			}
			return availableActions
		}

		player.hooks.onApply[instance] = (instance) => {
			if (player.custom[checkKey] && !player.custom[discardKey]) {
				if (player.board.singleUseCardUsed) {
					delete player.hooks.availableActions[instance]
					delete player.custom[this.getInstanceKey(instance, 'checkUsed')]
				}
			}

			if (player.custom[discardKey]) {
				// It may have been stolen by helskinght so we have to check if it's still there
				if (player.board.singleUseCard) {
					discardSingleUse(game, player)
				} else {
					// If it was stolen then we need to reset the flag so that the player
					// can play another single use card
					player.board.singleUseCardUsed = false
				}
				delete player.custom[discardKey]
			}
		}

		// We remove on turnEnd instead of onDetach because we need to keep the hooks
		// until the end of the turn in case the player plays another single use card
		player.hooks.onTurnEnd[instance] = () => {
			delete player.hooks.onTurnEnd[instance]
			delete player.hooks.availableActions[instance]
			delete player.hooks.onApply[instance]
			delete player.custom[this.getInstanceKey(instance, 'checkUsed')]
			delete player.custom[this.getInstanceKey(instance, 'discard')]
		}
	}

	getExpansion() {
		return 'alter_egos'
	}
}

export default FireChargeSingleUseCard
