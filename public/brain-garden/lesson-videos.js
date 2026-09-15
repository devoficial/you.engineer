import {videoAuthors} from './video-credits.js';
import {videos as regionVideos} from './content.js';
import {hindiCoverage,hindiVideos} from './hindi-videos.js';
const V=(id,title,author='Neuroscientifically Challenged',time=0)=>({id,title,author:videoAuthors[id]||author,time});
export const lessonVideos={
 anatomy:V('ADAOsuaOSCk','Anatomy of the Brain','Ninja Nerd'),functional:V('1CCNldjSEXs','Frontal Lobe: Anatomy & Function','Ninja Nerd'),
 frequencies:V('tZcKT4l_JZk','Electroencephalography (EEG)'),eeg:V('tZcKT4l_JZk','Electroencephalography (EEG)'),
 neurons:V('qOmmqu6_g3s','Neuron Anatomy & Function','Ninja Nerd'),electrical:V('Jk_9IhHVOTk','Resting Membrane, Graded, Action Potentials','Ninja Nerd'),
 synapses:V('WhowH0kb7n0','Synaptic Transmission'),chemistry:V('FXYX_ksRwIk','Types of Neurotransmitters','Khan Academy'),
 networks:V('YV3QuF-2wdw','Default Mode Network: one example of a brain network'),plasticity:V('BFKoCAB6e6w','Neuroplasticity'),
 memory:V('bSycdIx-C48','How We Make Memories','CrashCourse'),learning:V('qG2SwE_6uVM','How to Train a Brain','CrashCourse'),
 attention:V('jReX7qKU2yc','Selective Attention & Consciousness','CrashCourse',263),emotion:V('gAMbkJk6gnE','Feeling All the Feels','CrashCourse'),
 reward:V('f7E0mTJQ2KM','Reward System'),executive:V('i47_jiCsBMs','Prefrontal Cortex'),consciousness:V('jReX7qKU2yc','Consciousness','CrashCourse'),
 sleep:V('iWo90uxkNM0','Stages of Sleep'),sensory:V('gpIDVyM8V4U','Cranial Nerves: Sensory and Motor Overview','Ninja Nerd'),motor:V('APuiZCxDnTA','Motor Cortex'),
 language:V('lBqShvm4QRA','Language and the Brain','Khan Academy'),autonomic:V('7dZHmKMLdC0','Autonomic Nervous System','Ninja Nerd'),
 hormones:V('QAeBKRaNri0','HPA Axis'),metabolism:V('9zoS5WGsmpc','Cellular respiration: how cells produce ATP','Khan Academy'),
 blood:V('uMMMqkVZAhk','Blood Supply of the Brain'),csf:V('5mrd2fu3qvY','Ventricles of the Brain','Ninja Nerd'),cranial:V('gpIDVyM8V4U','Cranial Nerves: Overview','Ninja Nerd'),
 development:V('Tp25wrm-AoA','Early Neural Development'),aging:V('1tdWEAS5WnY','The Aging Brain','Dana Foundation'),disorders:V('BIdBznDpwkg','Stroke'),
 imaging:V('N2apCx1rlIQ','Neuroimaging'),lateralization:V('ZMSbDwpIyF4','The Left Brain vs. Right Brain Myth','TED-Ed'),
 bci:V('NK2ns4kPRcA','Conor Russomanno: Open-sourcing the Brain','Be Superhvman'),computational:V('MAOOPv3whZ0','Biological Neuron Models: Introduction','Neuromatch')
};
export const videoOverrides={
 'synapses/electrical':V('L3RIzzriNNs','Electrical Synapses'),
 'functional/visual':V('IBr5wCykSBE','Visual processing in the occipital lobe','Ninja Nerd'),'functional/auditory':V('YevzCMVgO_w','Auditory processing in the temporal lobe','Ninja Nerd'),
 'neurons/myelin':V('5V7RZwDpmXE','Myelin'),'neurons/glia':V('AwES6R1_9PM','Glial Cells'),
 'chemistry/gaba':V('bQIU2KDtHTI','GABA'),'chemistry/serotonin':V('Xkl_x6wC0Lg','Serotonin'),'chemistry/dopamine':V('Wa8_nLwQIpg','Dopamine'),
 'chemistry/glutamate':V('29QfkTjIWHU','Glutamate'),'chemistry/norepinephrine':V('m8kthApqQys','Norepinephrine'),
 'hormones/melatonin':V('SpaBMgZG9XQ','Melatonin'),'hormones/oxytocin':V('tLc9fQd58bg','Oxytocin'),
 'plasticity/ltp':V('uVQXZudZd5s','Long-term Potentiation and Synaptic Plasticity','Khan Academy'),
 'memory/working':V('bSycdIx-C48','Working Memory','CrashCourse',264),'memory/procedural':V('bSycdIx-C48','Procedural & Episodic Memory','CrashCourse',372),'memory/episodic':V('bSycdIx-C48','Procedural & Episodic Memory','CrashCourse',372),
 'learning/classical':V('qG2SwE_6uVM','Classical Conditioning','CrashCourse',167),'learning/operant':V('qG2SwE_6uVM','Operant Conditioning','CrashCourse',342),
 'sensory/touch':V('vF80u3qJkkQ','Touch Receptors'),'sensory/vestibular':V('P3aYqxGesqs','Vestibular System'),
 'disorders/stroke':V('BIdBznDpwkg','Stroke'),'disorders/epilepsy':V('OGFQhLPaaOQ','Epilepsy'),'disorders/parkinsons':V('7upHDhAmkqU','Parkinson’s Disease'),
 'disorders/alzheimers':V('I6K10aif0tE','Alzheimer’s Disease'),'disorders/migraine':V('uVLz-gjmiN0','Migraine'),'disorders/tbi':V('gLwtJcKh4gQ','Concussions: one type of traumatic brain injury'),
 'functional/motor':V('APuiZCxDnTA','Motor Cortex'),'functional/prefrontal':V('i47_jiCsBMs','Prefrontal Cortex'),'functional/language':V('lBqShvm4QRA','Language and the Brain','Khan Academy')
};
export function videoFor(topic,item){
 const hindi=hindiVideos[hindiCoverage[topic.id+'/'+item.id]];
 // The old concept timestamps belong to the English video, not its replacement.
 if(hindi)return {...hindi};
 if(topic.id==='anatomy'&&regionVideos[item.id]){const v=regionVideos[item.id];return {...V(v.id,v.en,v.author),language:'en'}}
 const video=videoOverrides[topic.id+'/'+item.id]||lessonVideos[topic.id];return {...video,time:item.time??video.time??0,language:'en'};
}
export function videoURL(video){return 'https://www.youtube.com/watch?v='+video.id+(video.time?'&t='+video.time+'s':'')}
