import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { CONTRACTS, EAS_SCHEMAS, ROLE_LIST } from './config';

// EAS contract address on Base
export const EAS_CONTRACT_ADDRESS = CONTRACTS.EAS_CONTRACT;

// Vouch schema definition
// Schema: bool positive, uint8[] roles, string comment, uint256 weightedPoints
export const VOUCH_SCHEMA = 'bool positive, uint8[] roles, string comment, uint256 weightedPoints';

// Initialize EAS (requires signer)
export function createEASInstance(signer: any): EAS {
    const eas = new EAS(EAS_CONTRACT_ADDRESS);
    eas.connect(signer);
    return eas;
}

// Encode vouch data for attestation
export function encodeVouchData(
    positive: boolean,
    roles: number[],
    comment: string,
    weightedPoints: bigint
): string {
    const schemaEncoder = new SchemaEncoder(VOUCH_SCHEMA);

    const encodedData = schemaEncoder.encodeData([
        { name: 'positive', value: positive, type: 'bool' },
        { name: 'roles', value: roles, type: 'uint8[]' },
        { name: 'comment', value: comment, type: 'string' },
        { name: 'weightedPoints', value: weightedPoints, type: 'uint256' },
    ]);

    return encodedData;
}

// Decode vouch data from attestation
export function decodeVouchData(data: string): {
    positive: boolean;
    roles: number[];
    comment: string;
    weightedPoints: bigint;
} {
    const schemaEncoder = new SchemaEncoder(VOUCH_SCHEMA);
    const decoded = schemaEncoder.decodeData(data);

    return {
        positive: decoded[0].value.value as boolean,
        roles: decoded[1].value.value as number[],
        comment: decoded[2].value.value as string,
        weightedPoints: decoded[3].value.value as bigint,
    };
}

// Get role names from role IDs
export function getRoleNames(roleIds: number[]): string[] {
    return roleIds.map(id => {
        const role = ROLE_LIST.find(r => r.id === id);
        return role ? role.name : 'Unknown';
    });
}

// Get role emojis from role IDs
export function getRoleEmojis(roleIds: number[]): string {
    return roleIds.map(id => {
        const role = ROLE_LIST.find(r => r.id === id);
        return role ? role.emoji : '❓';
    }).join(' ');
}

// Create attestation for vouch (requires signer)
export async function createVouchAttestation(
    eas: EAS,
    recipient: string,
    positive: boolean,
    roles: number[],
    comment: string,
    weightedPoints: bigint
): Promise<string> {
    const schemaId = EAS_SCHEMAS.VOUCH_SCHEMA;

    if (!schemaId) {
        throw new Error('Vouch schema ID not configured');
    }

    const encodedData = encodeVouchData(positive, roles, comment, weightedPoints);

    const tx = await eas.attest({
        schema: schemaId,
        data: {
            recipient,
            expirationTime: BigInt(0), // No expiration
            revocable: false,
            data: encodedData,
        },
    });

    const attestationUID = await tx.wait();
    return attestationUID;
}

// Get attestation by UID
export async function getAttestation(eas: EAS, uid: string) {
    const attestation = await eas.getAttestation(uid);
    return attestation;
}

// Utility to format attestation timestamp
export function formatAttestationTime(timestamp: bigint): string {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}
