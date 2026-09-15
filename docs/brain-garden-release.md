# Brain Garden — 15 September 2026

Production target: https://debasisnath.com/brain-garden/ on the existing `debasisnath` Netlify site.

## This release

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
