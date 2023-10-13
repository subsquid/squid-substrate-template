import {lookupArchive} from '@subsquid/archive-registry'
import {
    BlockHeader,
    DataHandlerContext,
    SubstrateBatchProcessor,
    SubstrateBatchProcessorFields,
    Event as _Event,
    Call as _Call,
    Extrinsic as _Extrinsic
} from '@subsquid/substrate-processor'

import {events} from './types'

export const processor = new SubstrateBatchProcessor()
    .setDataSource({
        // Lookup archive by the network name in Subsquid registry
        // See https://docs.subsquid.io/substrate-indexing/supported-networks/
        archive: lookupArchive('kusama', {release: 'ArrowSquid'}),
        // Chain RPC endpoint is required on Substrate
        chain: {
            // See https://docs.subsquid.io/substrate-indexing/setup/general/#set-data-source
            url: 'https://kusama-rpc.polkadot.io',
            rateLimit: 10
        }
    })
    .addEvent({
        name: [events.balances.transfer.name],
        extrinsic: true
    })
    .setFields({
        event: {
            args: true
        },
        extrinsic: {
            hash: true,
            fee: true
        },
        block: {
            timestamp: true
        }
    })

export type Fields = SubstrateBatchProcessorFields<typeof processor>
export type Block = BlockHeader<Fields>
export type Event = _Event<Fields>
export type Call = _Call<Fields>
export type Extrinsic = _Extrinsic<Fields>
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>
