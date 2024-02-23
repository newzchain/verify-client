// Copyright 2023 Blockchain Creative Labs LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import { SiweMessage } from 'siwe'
import '@lit-protocol/lit-node-client'
import { getConfig, init } from '../../../utils/config'
import {
  decryptAsset,
  encryptAsset,
  generateSIWEMessage,
  signAuthMessage
} from '../index'
import { hashImage } from '../../../write'
import { decryptToFile, encryptFile } from '@lit-protocol/lit-node-client'
import { getDefaultAuth } from '../access'
import { mockUnit8Array } from '../../../__fixtures__/data'
import { mockEnvVars } from '../../../__fixtures__/env'

mockEnvVars()

const mockSignerWalletAddress = '0xC0ab82C83e3d8Ad1d998a38CbDEEf3f89d787eaa'

const config = init({
  stage: '',
  pvtKey: '',
  rpcUrl: '',
  chainId: 0,
  chain: '',
  walletExpiryDays: 1
})

jest.mock('@lit-protocol/lit-node-client', () => {
  return {
    LitNodeClient: jest.fn().mockImplementation(() => {
      return {
        connect: jest.fn().mockResolvedValue(true),
        ready: true,
        config: {
          litNetwork: 'cayenne'
        }
      }
    }),
    encryptFile: jest.fn().mockResolvedValue(
      Promise.resolve({
        ciphertext: 'ciphertext',
        dataToEncryptHash: 'dataToEncryptHash'
      })
    ),
    decryptToFile: jest
      .fn()
      .mockResolvedValue(Promise.resolve(new Uint8Array([1, 2, 3, 4])))
  }
})

describe('test sign functions', () => {
  it('should be able to generate and siwe message', async () => {
    const chainId = getConfig().chainId
    const address = '0x123'

    const siweMessage = await new SiweMessage({
      domain: 'localhost',
      chainId,
      statement: 'authsign generated by an identity on verify',
      uri: 'http://localhost/login',
      version: '1',
      address
    })

    const _siweMessage = await generateSIWEMessage({
      address: '0x123',
      chainId: 80001
    })

    expect(siweMessage.statement).toEqual(_siweMessage.statement)
    expect(siweMessage.domain).toEqual(_siweMessage.domain)
  })

  it('should be able to sign an auth message', async () => {
    const sign = await signAuthMessage()
    expect(sign).toBeDefined()
    expect(sign.address).toBe(mockSignerWalletAddress)
    expect(sign.derivedVia).toBe('web3.eth.personal.sign')
  })
})

describe('test lit functions', () => {
  it('should be able to encrypt asset', async () => {
    const imageUrl =
      'https://fastly.picsum.photos/id/270/800/900.jpg?hmac=sV_J_B7YYHDLBUVn9bqsMj1wv18GJIzoMvb84vrMYgY'
    const blob = await fetch(imageUrl).then((res) => res.blob())

    const hash = await hashImage(imageUrl)
    const { ciphertext, dataToEncryptHash } = await encryptAsset({
      content: blob,
      contentHash: hash
    })

    const authorization = getDefaultAuth(
      hash,
      config.chain,
      config.contractAddress
    )

    expect(encryptFile).toHaveBeenCalledTimes(1)
    expect(encryptFile).toHaveBeenCalledWith(
      {
        file: blob,
        chain: getConfig().chain,
        authSig: expect.anything(),
        unifiedAccessControlConditions: authorization
      },
      expect.anything()
    )

    expect(ciphertext).not.toBe('')
    expect(dataToEncryptHash).not.toBe('')
  })

  it('should be able to decrypt asset', async () => {
    const imageUrl =
      'https://fastly.picsum.photos/id/270/800/900.jpg?hmac=sV_J_B7YYHDLBUVn9bqsMj1wv18GJIzoMvb84vrMYgY'
    const blob = await fetch(imageUrl).then((res) => res.blob())

    const hash = await hashImage(imageUrl)
    const { ciphertext, dataToEncryptHash } = await encryptAsset({
      content: blob,
      contentHash: hash
    })

    const authorization = getDefaultAuth(
      hash,
      config.chain,
      config.contractAddress
    )

    const asset = await decryptAsset({
      ciphertext,
      dataToEncryptHash,
      contentHash: hash
    })

    expect(decryptToFile).toHaveBeenCalledTimes(1)
    expect(decryptToFile).toHaveBeenCalledWith(
      {
        ciphertext: ciphertext,
        dataToEncryptHash: dataToEncryptHash,
        authSig: expect.anything(),
        chain: getConfig().chain,
        unifiedAccessControlConditions: authorization
      },
      expect.anything()
    )

    expect(asset).toBeDefined()
    expect(asset).toEqual(mockUnit8Array)
  })
})
