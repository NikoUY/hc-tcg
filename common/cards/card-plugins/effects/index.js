import WaterBucketEffectCard from './water-bucket'
import MilkBucketEffectCard from './milk-bucket'
import ShieldEffectCard from './shield'
import IronArmorEffectCard from './iron-armor'
import GoldArmorEffectCard from './gold-armor'
import DiamondArmorEffectCard from './diamond-armor'
import NetheriteArmorEffectCard from './netherite-armor'
import WolfEffectCard from './wolf'
import TotemEffectCard from './totem'
import BedEffectCard from './bed'
import ThornsEffectCard from './thorns'
import MendingEffectCard from './mending'
import LoyaltyEffectCard from './loyalty'
import StringEffectCard from './string'
import TurtleShellEffectCard from './turtle-shell'
import CommandBlockSingleUseCard from './command-block'
import EffectCard from './_effect-card'
import ChainmailArmorEffectCard from './chainmail-armor'
import LightningRodEffectCard from './lightning-rod'

/** @type {Array<EffectCard>} */
const EFFECT_CARDS = [
	new BedEffectCard(),
	new WolfEffectCard(),
	new MilkBucketEffectCard(),
	new GoldArmorEffectCard(),
	new IronArmorEffectCard(),
	new ShieldEffectCard(),
	new WaterBucketEffectCard(),
	new DiamondArmorEffectCard(),
	new NetheriteArmorEffectCard(),
	new TotemEffectCard(),
	new ThornsEffectCard(),
	new MendingEffectCard(),
	new LoyaltyEffectCard(),
	new StringEffectCard(),
	// new TurtleShellEffectCard(),
	new CommandBlockSingleUseCard(),
	new ChainmailArmorEffectCard(),
	new LightningRodEffectCard(),
]

export default EFFECT_CARDS
