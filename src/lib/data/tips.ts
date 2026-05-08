import type { LocationId, LocationTips } from './types';

export const tips: Record<LocationId, LocationTips> = {
  ruins: {
    effective: [
      { label: 'Blight', details: 'Low resistance across many enemies.' },
      { label: 'Crusader', details: 'Extra damage against Unholy enemies.' },
      { label: 'Direct damage', details: 'Few high-PROT targets.' }
    ],
    ineffective: [{ label: 'Bleed', details: 'Skeleton enemies resist bleed heavily.' }],
    dangers: [{ label: 'Stress dealers', details: 'Bone Courtier, Cultist Acolyte, and Madman.' }]
  },
  warrens: {
    effective: [{ label: 'Bleed', details: 'Low bleed resistance.' }, { label: 'Houndmaster', details: 'Strong against Beast enemies.' }],
    ineffective: [{ label: 'Blight', details: 'High resistance on common targets.' }],
    dangers: [{ label: 'Swinetaur', details: 'Punishes bad positioning.' }, { label: 'Disease', details: 'Bring herbs and consider safety provisions.' }]
  },
  weald: {
    effective: [{ label: 'Bandages', details: 'Many enemies and curios cause bleed.' }, { label: 'Antivenom', details: 'Blight is common.' }, { label: 'Shovels', details: 'More obstacles than most regions.' }],
    ineffective: [],
    dangers: [{ label: 'Rabid Gnasher', details: 'Fast bleed and disease pressure.' }, { label: 'Fungal Scratchers', details: 'Mark synergy can spiral.' }]
  },
  cove: {
    effective: [{ label: 'Blight', details: 'Works well into high-PROT enemies.' }, { label: 'Bandages', details: 'Common bleed pressure.' }, { label: 'Occultist', details: 'Many Eldritch targets.' }],
    ineffective: [{ label: 'Bleed', details: 'High bleed resistance.' }],
    dangers: [{ label: 'Thrall', details: 'Must be killed before explosion.' }, { label: 'Uca Crusher', details: 'High protection and guard pressure.' }]
  },
  courtyard: {
    effective: [{ label: 'Bleed', details: 'Strong against Bloodsuckers.' }, { label: 'The Blood', details: 'Bring a safety reserve for cursed heroes.' }],
    ineffective: [{ label: 'Torch planning', details: 'Courtyard light rules differ from normal dungeons.' }],
    dangers: [{ label: 'Craving', details: 'Blood management can decide the run.' }, { label: 'Bleed pressure', details: 'Bandages are safer than greed.' }]
  },
  farmstead: {
    effective: [{ label: 'Sustain', details: 'Endless waves reward healing, stress control, and endurance.' }, { label: 'Blight or armor piercing', details: 'Useful against high-PROT husks.' }],
    ineffective: [{ label: 'Traditional scouting', details: 'Farmstead flow is wave-based.' }],
    dangers: [{ label: 'Attrition', details: 'Provision for longer than you expect.' }, { label: 'Stress spikes', details: 'Bring answers to repeated stress waves.' }]
  }
};

export function getTipsForLocation(location: LocationId) {
  return tips[location];
}
