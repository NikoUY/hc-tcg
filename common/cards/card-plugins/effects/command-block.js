import EffectCard from './_effect-card'
import {GameModel} from '../../../../server/models/game-model'
import {HERMIT_CARDS} from '../../../../common/cards'

/**
 * @typedef {import('common/types/pick-process').PickedSlots} PickedSlots
 * @typedef {import('common/types/cards').CardPos} CardPos
 */

class CommandBlockEffectCard extends EffectCard {
	constructor() {
		super({
			id: 'command_block',
			name: 'Command Block',
			rarity: 'rare',
			description:
				"Attach to any active or AFK Hermit.\n\nItems attached to this Hermit become any type.\n\nThis card can only be removed once the Hermit it's attached to is knocked out.",
		})
	}

	/**
	 * @param {GameModel} game
	 * @param {string} instance
	 * @param {CardPos} pos
	 */
	onAttach(game, instance, pos) {
		const {player} = pos

		// Used to know when to ignore available actions hook
		player.custom[this.getInstanceKey(instance)] = true

		player.hooks.availableActions[instance] = (availableActions) => {
			if (!player.custom[this.getInstanceKey(instance)]) return availableActions

			const {activeRow, rows} = player.board
			if (activeRow === null || !rows[activeRow]) return availableActions

			const hermitCard = rows[activeRow].hermitCard
			if (!hermitCard) return availableActions

			const ailments = rows[activeRow].ailments
			const isSleeping = ailments.find((a) => a.id === 'sleeping')
			const isSlow = ailments.find((a) => a.id === 'slowness')
			const itemCards = rows[activeRow].itemCards
			const hermitInfo = HERMIT_CARDS[hermitCard.cardId]
			const primaryHasEnoughItems =
				itemCards.length >= hermitInfo.primary.cost.length
			const secondaryHasEnoughItems =
				itemCards.length >= hermitInfo.secondary.cost.length

			if (!isSleeping) {
				if (primaryHasEnoughItems) {
					availableActions.push('PRIMARY_ATTACK')
				}

				if (!isSlow && secondaryHasEnoughItems) {
					availableActions.push('SECONDARY_ATTACK')
				}
			}

			return availableActions
		}

		player.hooks.afterAttack[instance] = (attackResult) => {
			player.custom[this.getInstanceKey(instance)] = false
		}

		player.hooks.turnStart[instance] = () => {
			player.custom[this.getInstanceKey(instance)] = true
		}
	}

	onDetach(game, instance, pos) {
		const {player} = pos
		delete player.custom[this.getInstanceKey(instance)]
		delete player.hooks.availableActions[instance]
		delete player.hooks.afterAttack[instance]
		delete player.hooks.turnStart[instance]
	}

	/**
	 * @returns {boolean}
	 */
	getIsRemovable() {
		return false
	}

	getExpansion() {
		return 'alter_egos'
	}
}

export default CommandBlockEffectCard
