# Brain Garden — 15 September 2026

Production target: https://debasisnath.com/brain-garden/ on the existing `debasisnath` Netlify site.

## Full-body guided tour

All 211 concepts now enter through the same full-body 3D view. A visible Start journey button begins a paced sequence: locate the organ or body part, magnify its mechanism or highlight the brain region, then return to the whole person at the end. A small body locator remains visible beside enlarged scenes. Back, Next, Pause, replay and a contextual sound-response choice support self-paced use. One short English/Bengali explanation appears at a time; technical carriers, sources and physiological qualifications stay in disclosures. Existing free exploration and isolated opaque brain anatomy remain accessible.

The 2.4 MB body asset contains twelve anatomical surfaces adapted from BodyParts3D: skin, cardiac walls, stomach, kidneys, trachea, bronchi and aorta. Attribution, pinned source paths, source hashes and conversion instructions are in `public/brain-garden/body/BODY-MODEL-NOTICE.json`; the adapted model remains CC BY-SA 2.1 Japan. Skin stays opaque with explicit head and torso cutaways. Lung envelopes, nerves, routes, adrenal markers and enlarged mechanisms are teaching constructions. Camera scale changes are labeled. This is a sequence of teaching examples, not a complete biological simulation or a claim that shared templates are unique pathways for each concept.

Neural, spinal-reflex, hormonal, circulatory and device routes have distinct routing rules. Withdrawal uses the spinal circuit without first visiting the cortex. Hormone routes pass through blood toward their target organs. EEG recording stages include a live illustrative trace with units and slowed playback. Missing brain structures use the existing approximate locators instead of assigning an unrelated surface.

Validation for this update:

- Twenty-two permanent curriculum, physiology, numerical and guided-tour tests cover all 211 concepts, both languages, route direction, anatomical targets, captions, pacing and finite body-model geometry.
- The actual-GLTF integration harness checks 1,635 guided stages, body-first entry, pacing, camera continuity, branch decisions, completion/replay, language preservation, hidden-view pause and the EEG readout. Its WebGL renderer and OrbitControls are substituted; real browser checks separately inspect rendering.
- Browser QA covers mobile and desktop, the full-body entrance, hearing close-ups and named brain relays, delta-wave recording, Bengali regulation and anatomy. Existing Hindi video previews remain unchanged.
- The static Netlify build and portfolio rendering checks are required before publication. Deployment preserves the existing domain's other files and verifies published asset hashes.

## Detailed Three.js mechanism update

The primary lesson now switches between a mechanism close-up and the anatomical brain pathway. Eleven shared, interactive 3D models show cortical populations and EEG recording, a myelinated neuron, chemical synapses, electrical gap junctions, cochlear mechanics, hair-cell transduction, retinal optics, skin receptors, muscle spindles, motor end plates and muscle fibers, and vascular transport. These models are selected by the current journey stage. They replace the generic node-chain presentation; the optional numerical charts remain available.

- The frequency lessons now follow postsynaptic currents, timing alignment, electric fields through tissue, electrode difference and signal interpretation. A live synthetic waveform responds to frequency and phase alignment. The individual component and combined signal have separate keys; amplitude is not inferred solely from frequency. All cortical lobes remain context, avoiding a false single “delta location.”
- Hearing moves from eardrum and ossicles through a pitch-sensitive cochlear response, an enlarged hair-cell bundle and auditory nerve output, then the named brainstem/thalamic/cortical relays. The cellular view distinguishes receptor potentials from afferent spikes. Muscle stretch feedback has its own spindle model, separate from the motor end plate.
- Component tabs and labels focus the camera and reveal one explanation. Overview restores the full mechanism. Animation runs independently of the guided steps, with pause/play and reduced-motion support. Orbit/keyboard controls expose “Reset view” only after the view changes.
- Brain pathways retain solid anatomical surfaces, with active/previous labels, animated schematic connections and an automatic camera move to the active region. The pathway has its own motion pause control.
- New geometry is procedural teaching geometry, not scanned organs, tractography or a complete physiological simulator. The original brain surfaces provide anatomical context. Time is slowed spatially; traces show explicitly synthetic values and units. Existing English/Bengali content and Hindi-preferred video previews remain intact.

Scientific references include the [EEG atlas](https://www.ncbi.nlm.nih.gov/books/NBK390351/), [extracellular-field review](https://pmc.ncbi.nlm.nih.gov/articles/PMC4907333/) and [NIDCD hearing guide](https://www.nidcd.nih.gov/health/how-do-we-hear), alongside the existing journey sources.

Validation:

- Seventeen permanent curriculum, pathway and numerical-model tests pass, plus two portfolio rendering checks. The static Netlify build succeeds.
- The actual-GLTF/Linkedom harness constructs all 211 concepts and visits all 1,599 journey stages, checking finite new geometry, preserved opaque selections and isolation, pathways, branches, language, videos and view switching. Additional checks cover animation pause/resume, component focus, parameter synchronization and the spindle model.
- Real browser checks at 1280 px and 390 px cover the new model families, English/Bengali labels, focus controls, mobile overflow, view reset and scientific signal distinctions. Browser warning/error logs are empty in the checked preview. Renderer behavior is visually inspected separately from the integration harness, which substitutes WebGL and OrbitControls.
- New moving particles use instancing; branching dendrites use merged geometry. Inactive views stop animating and the mechanism renderer is reused. Device-specific GPU performance has not been benchmarked.

## Focused experience and Hindi video update

The main view now uses two compact selectors for topic and concept. Search and family filters open on demand. A lesson leads with its body/brain visual, playback controls and one current explanation. The full route, organ close-up, contextual notes and references use collapsed disclosures. Hearing response choices appear at the decision stage, where automatic playback pauses. Anatomy keeps its opaque, selectable surfaces and isolated view.

All 211 concepts have video thumbnail previews and click-to-play embeds, plus a direct YouTube link. Fifty verified Hindi teaching videos cover 139 concepts; 72 concepts retain the existing English fallback. The language is shown on each card, independent of the English/Bengali interface. Coverage is explicit per concept, and existing English chapter offsets are never transferred to Hindi videos. See [video curation](brain-garden-hindi-videos.md) for sources and verification limits.

Validation for this update:

- Thirteen curriculum/pathway Node tests and two rendered portfolio tests pass; the static Netlify build succeeds.
- The actual-GLTF/Linkedom integration harness passes all 1,599 stages and the new disclosure, search, video language, thumbnail failure and player lifecycle checks. No iframe exists before a click; selecting a different concept removes the old player.
- Browser checks at 390 px, the existing 440 px panel, and 1280 px cover the responsive layout. English and Bengali fit without horizontal page overflow. Search reaches the Alpha lesson and returns keyboard focus to the search button. Hindi thumbnail loading and actual inline YouTube playback were visually verified; selecting another concept removes the player. Browser warning/error logs were empty during that check. Temporary viewport sizing was reset.
- Public YouTube metadata resolves all 50 Hindi videos and reports them embeddable. This does not guarantee every future viewer can play every video; direct YouTube links remain available.

## Body–brain journey update

The 33 groups outside anatomy now use a human-body pathway view as the primary lesson. Anatomy retains the existing opaque, selectable 3D model and isolated pieces. The 193 non-anatomy concepts use 51 shared journey templates with concept-specific variants; selecting a concept opens its relevant stage. Shared physiological segments are reused where appropriate rather than implying that every concept has a separate biological pathway.

- A clickable human body shows sensory routes, descending motor output, autonomic control, blood supply, hormones and recording equipment. A synchronized 3D brain highlights named source surfaces, switches to a deep view when needed and orients toward the active region.
- Hearing follows 15 stages from pressure waves and middle-ear bones to cochlear hair cells, CN VIII, cochlear nuclei, superior olive, lateral lemniscus, inferior colliculus, medial geniculate relay, auditory cortex, recognition, decision and head movement. Users can choose to keep listening instead of turning. A pitch selector demonstrates cochlear tonotopy; an inner-hair-cell close-up explains transduction.
- Other examples cover the senses, voluntary movement, spinal withdrawal, visceral feedback, hormone axes, energy/CSF supply, cognition, sleep, rhythms, development, aging, disorders, measurements and brain–computer interfaces.
- Each stage names the carrier, mechanism and neighboring stages. Parallel branches are explicitly explained. Motor nerves, hormones, blood and electronic commands are kept distinct. Both languages, source citations and the existing YouTube links remain available.
- Cellular and quantitative charts remain optional detail panels where appropriate. They are no longer the primary visualization for non-anatomy topics.

These are physiological teaching journeys, not a complete real-time human simulation. Curved connections do not reconstruct axons. Small missing structures use explicitly labelled approximate wireframe locators or their containing surface. MRI/EEG views are diagrams of measurement, not patient data. Long-term learning, development and aging stages are not real-time biological timelines. Playback is deliberately slowed.

Body-update validation: five permanent pathway tests plus seven existing curriculum tests and two portfolio checks pass. The actual-GLTF/Linkedom harness additionally traversed all 1,599 journey stages across 193 concepts, checking finite geometry, visible/opaque selected surfaces, schematic locators, deep-view reset, hearing branches, pitch controls, English/Bengali state, pause/scrub and body navigation. Browser visual/interaction QA was not performed. Publication preserves the existing Netlify site's other files and verifies production hashes.

## Earlier anatomy and curriculum release

- Keep every context-brain surface opaque during selection. Highlight and extract the selected part without fading other selectable regions.
- Provide 34 numbered topic groups, seven navigation families and 211 selectable concepts in English and Bengali.
- Select each of the model's 63 named surfaces independently, with localized names, explanatory notes, an isolated rotatable view, reassembly and keyboard controls. Two nonspecific source surfaces remain excluded.
- Add labelled teaching scenes for cells, chemical and electrical communication, pathways, rhythms, regulation, layers and other lesson topics. Use the existing anatomical geometry as the brain locator.
- Provide parameter-controlled waveforms, spectra, membrane potentials, synaptic summation, learning curves, prediction errors, feedback, sleep stages, synthetic decoding and leaky integrate-and-fire models.
- Add topic/concept search, hash links with language and individual structure, Back/Forward support, optional local progress and source links.
- Associate all concepts with a related YouTube lesson. The catalogue contains 58 distinct verified videos; some concepts share a relevant overview. The twelve cranial nerves link to their respective chapters.

## Representation limits and subsequent atlas work

This is an introductory release covering all 34 groups, using the existing anatomical model and explicitly labelled teaching diagrams. It does not complete every advanced storyboard in the larger plan. Deep structures absent from the source asset, vessels, cranial nerves and cellular geometry use schematics. Diagrams do not establish anatomical coordinates or clinical measurements. Imaging lessons use an illustrative section plane, not patient scans or a volumetric MRI viewer.

Further atlas milestones include validated meshes and tract assets; detailed functional overlays; EEG channel/reference and scalp-map demonstrations; real, licensed imaging volumes with orthogonal slices; more specialized per-concept storyboards and video chapters; and representative-device visual/performance testing. Scientific diagrams, particularly cognitive and disorder mechanisms, remain simplified and evidence-qualified.

## Validation

- Node content/numerical tests cover all concepts, both languages, routes, source model references, chart extremes, frequency/amplitude independence, spectral peaks, phase cancellation, neuronal threshold and monotonic model responses.
- A temporary Linkedom integration harness loads the actual GLTF geometry and every scene while substituting only WebGL rendering and camera controls. It exercises all concepts, language and history state, parameter changes, opaque selection, reset, drag state, invalid mesh fallback and each of the 63 individual selections.
- YouTube oEmbed resolved all 58 distinct video URLs. Publisher names are recorded in `video-credits.js`. Videos were checked on 15 September 2026 and can change later.
- The static Netlify build and existing portfolio rendering checks pass. No browser interaction or screenshot QA was performed for this release.
- Deployment uses a digest manifest and preserves all non-Brain-Garden files from the current production deployment. Verify production hashes after publication.
