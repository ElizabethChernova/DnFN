# DnFN

DnFn (_Definitely not Fruit Ninja_) is a mini-game heavily inspired by Fruit Ninja. It was developed for the practicals
of the _Simulation and Animation_ course.

## Getting Started

Most modern web browser will not allow DnFN to run directly when opening the local `index.html` file due to their
restrictive Cross-origin security policies. To circumvent this issue, a local web server serving the files has to be 
started. We recommend using Python's `http.server` as it is part of the Python standard library and thus installed on
many systems.

```shell
cd DnFN # start the server in the DnFN main directory 
python3 -m http.server 8000
```

If the server starts successfully, head over to [localhost:8000](localhost:8000) to start playing! 🎮