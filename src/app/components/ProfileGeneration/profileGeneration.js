import { characterPrompts } from "./characterPrompt";

const determineArchetype = (totalScore) => {
    if (totalScore >= 15) {
        return "The Protagonist";
    } else if (totalScore >= 8 && totalScore < 15) {
        return "The Sidekick";
    } else {
        return "The Anti-Hero";
    }
};

export const GenerateProfile = (scores) => {
    const totalScore = scores?.reduce((a, b) => a + b, 0) || 0;
    const archetype = determineArchetype(totalScore);

    let traitsMap = {
        high: {
            dominantTraits: ["Courageous", "Loyal", "Determined", "Confident", "Compassionate"],
            archetype: "The Protagonist",
        },
        medium: {
            dominantTraits: ["Resourceful", "Optimistic", "Creative", "Adaptable"],
            archetype: "The Sidekick",
        },
        low: {
            dominantTraits: ["Reserved", "Cunning", "Apathetic", "Pessimistic"],
            archetype: "The Anti-Hero",
        },
    };

    let profile;
    if (totalScore > 13) {
        profile = traitsMap?.high
    } else if (totalScore > 6) {
        profile = traitsMap?.medium
    } else {
        profile = traitsMap?.low
    }

    const matchingCharacter = characterPrompts?.find(
        character => character?.traits?.personality?.some(trait => profile?.dominantTraits?.includes(trait))
    )
    const allTraits = [...new Set(characterPrompts.flatMap(character => character.traits.personality))];

    // Preparing data for Radar Chart
    const numberOfTraits = allTraits?.length;
    const baseValue = numberOfTraits > 0 ? Math.floor(totalScore / numberOfTraits) : 0;
    const remainder = (totalScore) % (numberOfTraits);

    const radarChartData = allTraits.map((trait) => {
        let value = 0;
        const traitIndex = profile.dominantTraits.indexOf(trait);
        if (traitIndex !== -1) {
            value = baseValue;
            if (traitIndex < remainder) {
                value += 1;
            }
        }
        return { trait, value };
    });

    return {
        dominantTraits: profile.dominantTraits.join(', '),
        totalScore,
        archetype,
        suggestedCharacter: matchingCharacter || null,
        radarChartData
    };
}