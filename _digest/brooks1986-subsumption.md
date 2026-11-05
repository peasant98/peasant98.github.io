---
title: A Robust Layered Control System for a Mobile Robot
arxiv: ''
date: '1986-03-01'
added: '2026-11-05'
authors: Rodney A. Brooks
venue: IEEE Journal on Robotics and Automation
doi: 10.1109/JRA.1986.1087032
pdf: https://mae.engr.ucdavis.edu/dsouza/brooks.pdf
website: ''
code: ''
topics:
- foundations
- planning-control
seminal: true
tldr: Brooks splits mobile-robot control into stacked layers of behaviors (avoid, wander, explore) instead of a perceive-model-plan-act chain, and higher layers take over by suppressing the wires of lower ones. A real robot running the system went a number of hours in a lab and a machine room without hitting a moving or fixed obstacle.
abstract: A new architecture for controlling mobile robots is described. Layers of control system are built to let the robot operate at increasing levels of competence. Layers are made up of asynchronous modules that communicate over low-bandwidth channels. Each module is an instance of a fairly simple computational machine. Higher-level layers can subsume the roles of lower levels by suppressing their outputs. However, lower levels continue to function as higher levels are added. The result is a robust and flexible robot control system. The system has been used to control a mobile robot wandering around unconstrained laboratory areas and computer machine rooms. Eventually it is intended to control a robot that wanders the office areas of our laboratory, building maps of its surroundings using an onboard arm to perform simple tasks.
thumb:
  image: brooks1986-subsumption/thumb.webp
  width: 671
  height: 275
videos: []
youtube: []
figures:
- image: brooks1986-subsumption/figure1.webp
  width: 671
  height: 275
  caption: 'From Figure 3: Every layer reads the sensors, and higher layers subsume the roles of lower ones when they take control. Cut the stack at any level and the layers below still form a complete control system.'
- image: brooks1986-subsumption/figure2.webp
  width: 1094
  height: 922
  caption: 'From Figure 7: Wiring of the level 0, 1 and 2 control systems. Circles marked S suppress an input and I inhibits an output, with the time constant written inside.'
- image: brooks1986-subsumption/figure3.webp
  width: 619
  height: 1258
  caption: 'From Figure 10: Simulated robot under level 2 control. (a) It follows two commanded goals (the nominal straight lines) while avoiding the square obstacle. (b) With no new goals after the second, it reverts to aimless level 1 wandering.'
---
## What they do
Mobile-robot control systems were usually built as a chain of functional modules: perception, modelling, planning, task execution and motor control. Brooks slices the problem by behavior instead, into "levels of competence": avoid objects, wander, explore, build maps, and so on. Each layer together with the layers below it is a complete control system, and new layers are added without changing the old ones. He calls this the subsumption architecture.

## How it works
- **Layers.** Level 0 is built, debugged and never altered. A higher layer reads lower layers' data and can suppress (replace) one of their inputs or inhibit an output for a fixed time. The lower layers keep running, unaware of it.
- **Modules.** Each layer is a set of finite state machines with a few variables. They talk over wires with one-message buffers, no handshaking and no shared memory, so messages can be lost.
- **Level 0 (avoid).** Each sonar return acts as a repulsive force. Runaway turns the robot away when the summed force is significant, and Collide halts it when something is dead ahead.
- **Levels 1 and 2.** Wander picks a new heading every ten seconds or so, and Avoid bends it away from obstacles, suppressing Runaway. Level 2 looks for corridors of free space, and Pathplan steers along them by dead reckoning, suppressing Wander.

## Results
- In simulation (±5 percent turn and travel error, noisy sonars that bounce off walls), levels 0 and 1 wander without hitting obstacles. Level 2 follows two given corridors, still avoids a square obstacle, then goes back to wandering.
- The physical robot has 12 sonars and two cameras, with most processing off-board on a Lisp machine. Over a number of hours it has not collided with moving or fixed obstacles, though the moving ones moved slowly. Under level 0, two people can herd it through doors. Under level 2 it detours around people and still reaches its goal.
- Sixteen states were more than enough for every module written.

## Limitations
Level 2 is incomplete: the stereo module was replaced by a sonar-based corridor finder. Pathplan ignores wheel slip, so goals are not reached exactly. If a sonar error puts a goal behind a wall, the robot stalls until Whenlook starts a new search. All modules still run on one Lisp machine, and there is no comparison with other architectures.
