# oscar-fossology

This is a small HTTP wrapper around the scanners used in Fossology.

To run locally

```sh
docker build --no-cache -t codescoopltd/oscar-fossology:0.0.1 .
docker run -p 3000:3000 --env PROFILE=local codescoopltd/oscar-fossology:0.0.1
```