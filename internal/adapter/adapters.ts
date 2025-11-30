import { PrismaClient } from "@prisma/client"
// import { S3Client } from "@aws-sdk/client-s3"
import { RedisClientType } from "redis"

let Adapters: Adapter
let options: Option[] = []

interface Option {
    Start(adapter: Adapter):void
    Close(): void
}

class Adapter {
    mysql!: PrismaClient
    redis!: RedisClientType

    sync(options: Option[]) {
        options.forEach((option) => {
            option.Start(this)
        })
    }

    unsyc() {
        var errors: Error[] = []

        options.forEach((option) => {
            try {
                option.Close()
            } catch (error) {
                if (error instanceof Error) {
                    errors.push(error)
                } else {
                    errors.push(new Error(String(error)))
                }
            }
        })

        if (errors.length > 0){
            console.log(errors)
        }
    }
}

function initializeAdapters() : Adapter {
    const adapter = new Adapter()
    Adapters = adapter
    return adapter
}

function getAdapters(): Adapter {
    if (!Adapters) {
        throw new Error(
            "Adapter not initialized, Call initializeAdapters() first"
        )
    }
    return Adapters
}

export { Adapter, Adapters, Option, initializeAdapters, getAdapters }
