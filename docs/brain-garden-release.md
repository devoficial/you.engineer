# Brain Garden — 15 September 2026

Production target: https://debasisnath.com/brain-garden/ on the existing `debasisnath` Netlify site.

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
