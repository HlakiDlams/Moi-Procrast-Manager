import type { Course } from '../types'

/**
 * Engineering Graphics and Design (CAPS Gr 12).
 * EGD is drawn on paper, so this course drills the rules, conventions and
 * calculations behind the drawings. Practise the drawing itself with your Impaq work.
 */
export const EGD: Course = {
  id: 'egd',
  name: 'EGD',
  icon: '📏',
  color: '#FFD166',
  subjectName: 'EGD',
  group: 'school',
  units: [
    {
      id: 'e-basics',
      title: 'Drawing conventions',
      icon: '📐',
      description: 'Line types, scales, dimensioning',
      lessons: [
        {
          id: 'e-lines',
          title: 'Line types',
          teach: {
            text: [
              'Thick continuous: visible outlines and edges.',
              'Thin dashed (- - -): hidden detail.',
              'Thin chain (long dash, dot): centre lines.',
              'Thin continuous: dimension lines, projection lines, hatching.',
              'Thin chain, thick at the ends and corners: cutting plane.',
            ],
          },
          questions: [
            { id: 'el-1', type: 'mcq', prompt: 'Which line shows a hidden edge?', options: ['Thin dashed', 'Thick continuous', 'Thin chain', 'Thin continuous'], answer: 0, explain: 'Hidden detail = thin dashed lines.' },
            { id: 'el-2', type: 'mcq', prompt: 'Which line is used for the centre of a circle or hole?', options: ['Thin chain (long dash, dot)', 'Thin dashed', 'Thick continuous', 'Zig-zag'], answer: 0, explain: 'Centre lines = thin chain.' },
            { id: 'el-3', type: 'mcq', prompt: 'Visible outlines are drawn with…', options: ['Thick continuous lines', 'Thin continuous lines', 'Thin dashed lines', 'Thin chain lines'], answer: 0, explain: 'Visible edges must stand out: thick continuous.' },
            {
              id: 'el-4',
              type: 'match',
              prompt: 'Match the line to its use',
              pairs: [
                ['Thick continuous', 'visible outline'],
                ['Thin dashed', 'hidden detail'],
                ['Thin chain', 'centre line'],
                ['Thin continuous', 'dimension line'],
              ],
              explain: 'These four come up on every drawing.',
            },
            { id: 'el-5', type: 'mcq', prompt: 'Section hatching lines are…', options: ['Thin continuous lines, usually at 45°', 'Thick lines at 90°', 'Thin dashed lines', 'Thin chain lines'], answer: 0, explain: 'Hatching = thin continuous lines, normally at 45°.' },
          ],
        },
        {
          id: 'e-scale',
          title: 'Scale and dimensioning',
          teach: {
            text: [
              'Scale = drawing size : real size.',
              '1:2 → drawing is half size (reduction). 2:1 → twice the size (enlargement).',
              '1:100 → 1 mm on paper = 100 mm in real life.',
              'Dimensions are in millimetres (mm). You don\'t write "mm" on each dimension.',
              'Always write the REAL size, whatever the scale.',
            ],
            example: ['Wall 5 m long, scale 1:100', '5 m = 5000 mm', '5000 ÷ 100 = 50 mm on the drawing'],
          },
          questions: [
            { id: 'es-1', type: 'mcq', prompt: 'Scale 1:2 means the drawing is…', options: ['half the real size', 'twice the real size', 'the real size', '2 mm bigger'], answer: 0, explain: '1 on paper for every 2 in real life = half size.' },
            { id: 'es-2', type: 'input', prompt: 'A wall is 5 m long. How long is it on a 1:100 drawing? (mm)', answers: ['50'], numeric: true, explain: '5000 mm ÷ 100 = 50 mm.' },
            { id: 'es-3', type: 'input', prompt: 'At scale 1:50, a line is 80 mm on paper. Real length in mm?', answers: ['4000'], numeric: true, explain: '80 × 50 = 4000 mm (= 4 m).' },
            { id: 'es-4', type: 'mcq', prompt: 'A part is drawn at 2:1. A 15 mm edge is drawn as…', options: ['30 mm', '7.5 mm', '15 mm', '17 mm'], answer: 0, explain: '2:1 = twice the size: 15 × 2 = 30 mm.' },
            { id: 'es-5', type: 'mcq', prompt: 'A 40 mm hole is drawn at scale 1:2. Which dimension do you write on it?', options: ['40', '20', '80', '40 mm ÷ 2'], answer: 0, explain: 'Always dimension the real size: 40.' },
            { id: 'es-6', type: 'mcq', prompt: 'Standard unit for EGD dimensions', options: ['millimetres', 'centimetres', 'metres', 'inches'], answer: 0, explain: 'Engineering drawings use mm.' },
          ],
        },
      ],
    },
    {
      id: 'e-ortho',
      title: 'Orthographic projection',
      icon: '🧊',
      description: 'Views, first and third angle',
      lessons: [
        {
          id: 'e-angles',
          title: 'First vs third angle',
          teach: {
            text: [
              'Orthographic = separate flat views: front view, top view, side view.',
              'FIRST angle: top view goes BELOW the front view; left view goes to the RIGHT of the front view.',
              'THIRD angle: top view goes ABOVE the front view; right view goes to the RIGHT of the front view.',
              'Tip: in third angle, each view sits on the side it was seen from.',
              'The projection symbol (a cone shape) tells you which method is used.',
            ],
          },
          questions: [
            { id: 'ea-1', type: 'mcq', prompt: 'In FIRST angle projection, the top view is placed…', options: ['below the front view', 'above the front view', 'to the left of the front view', 'anywhere'], answer: 0, explain: 'First angle: top view below.' },
            { id: 'ea-2', type: 'mcq', prompt: 'In THIRD angle projection, the top view is placed…', options: ['above the front view', 'below the front view', 'to the right of the front view', 'on a new page'], answer: 0, explain: 'Third angle: views sit on the side they were seen from, so top view above.' },
            { id: 'ea-3', type: 'mcq', prompt: 'First angle: the LEFT view goes…', options: ['to the right of the front view', 'to the left of the front view', 'above the front view', 'below the top view'], answer: 0, explain: 'First angle swaps sides: left view on the right.' },
            { id: 'ea-4', type: 'mcq', prompt: 'How do you know which projection method a drawing uses?', options: ['The projection symbol in the title block', 'The scale', 'The line thickness', 'The paper size'], answer: 0, explain: 'The cone-shaped symbol shows first or third angle.' },
            { id: 'ea-5', type: 'mcq', prompt: 'How many views are usually drawn in orthographic projection?', options: ['Three (front, top, side)', 'One', 'Six always', 'Two always'], answer: 0, explain: 'Usually three views describe the object fully.' },
          ],
        },
        {
          id: 'e-sections',
          title: 'Sectional views',
          teach: {
            text: [
              'A section shows the inside of an object as if it were cut along the cutting plane.',
              'The cut surface is hatched with thin lines at 45°.',
              'Parts touching each other are hatched in opposite directions.',
              'NOT hatched when cut lengthwise: shafts, bolts, nuts, screws, keys, pins, ribs/webs.',
              'Hidden lines are normally left out of sectional views.',
            ],
          },
          questions: [
            { id: 'ese-1', type: 'mcq', prompt: 'At what angle is hatching normally drawn?', options: ['45°', '30°', '90°', '60°'], answer: 0, explain: 'Standard hatching = 45°.' },
            { id: 'ese-2', type: 'mcq', prompt: 'Which part is NOT sectioned when cut lengthwise?', options: ['A bolt', 'A bracket body', 'A pulley rim', 'A housing'], answer: 0, explain: 'Bolts, nuts, shafts, keys, pins and webs are not hatched.' },
            { id: 'ese-3', type: 'mcq', prompt: 'Two different parts touch in a section. Their hatching…', options: ['goes in opposite directions', 'is identical', 'is left out', 'is drawn thick'], answer: 0, explain: 'Opposite directions show they are separate parts.' },
            { id: 'ese-4', type: 'mcq', prompt: 'Are hidden lines normally shown in a sectional view?', options: ['No', 'Yes, always', 'Only in red'], answer: 0, explain: 'Sections already show the inside, so hidden lines are left out.' },
            { id: 'ese-5', type: 'mcq', prompt: 'Which line shows where the object is cut?', options: ['Cutting plane line (thin chain, thick at the ends)', 'Centre line', 'Hidden line', 'Outline'], answer: 0, explain: 'The cutting plane line, with arrows showing the viewing direction.' },
          ],
        },
      ],
    },
    {
      id: 'e-pictorial',
      title: 'Pictorial drawing',
      icon: '🏙️',
      description: 'Isometric and perspective',
      lessons: [
        {
          id: 'e-iso',
          title: 'Isometric drawing',
          teach: {
            text: [
              'Isometric axes: one vertical, two at 30° to the horizontal.',
              'In an isometric DRAWING, lengths along the axes are measured TRUE length.',
              'Circles become ellipses (use the 4-centre method or a template).',
              'Hidden lines are usually not shown.',
              'Lines that are not parallel to an axis can\'t be measured. Plot their end points instead.',
            ],
          },
          questions: [
            { id: 'ei-1', type: 'mcq', prompt: 'Isometric axes are drawn at…', options: ['30° to the horizontal', '45° to the horizontal', '60° to the horizontal', '90°'], answer: 0, explain: 'Two axes at 30°, one vertical.' },
            { id: 'ei-2', type: 'mcq', prompt: 'A circle in isometric becomes…', options: ['an ellipse', 'a circle', 'a square', 'a triangle'], answer: 0, explain: 'Circles look like ellipses in isometric.' },
            { id: 'ei-3', type: 'mcq', prompt: 'In an isometric drawing, a 60 mm edge along an axis is drawn…', options: ['60 mm (true length)', '30 mm', '120 mm', '45 mm'], answer: 0, explain: 'Along the axes = true length.' },
            { id: 'ei-4', type: 'mcq', prompt: 'A sloping edge NOT parallel to an axis is drawn by…', options: ['plotting its end points', 'measuring its true length', 'drawing it at 45°', 'leaving it out'], answer: 0, explain: 'Non-isometric lines: locate the two ends, then join them.' },
            { id: 'ei-5', type: 'mcq', prompt: 'Method often used to construct isometric circles', options: ['4-centre method', 'Ordinate method only', 'Trammel method only', 'Freehand only'], answer: 0, explain: 'The 4-centre method approximates the ellipse with 4 arcs.' },
          ],
        },
        {
          id: 'e-persp',
          title: 'Perspective',
          teach: {
            text: [
              'Perspective drawings look real: things get smaller further away.',
              'Horizon line (HL) = eye level of the viewer.',
              'Vanishing points (VP) sit on the horizon line. Two-point perspective has 2 VPs.',
              'Station point (SP) = where the viewer stands. Picture plane (PP) = the "window" you draw on.',
              'In two-point perspective, vertical lines stay vertical.',
            ],
          },
          questions: [
            { id: 'ep-1', type: 'mcq', prompt: 'How many vanishing points in two-point perspective?', options: ['2', '1', '3', '0'], answer: 0, explain: 'Two-point = 2 VPs.' },
            { id: 'ep-2', type: 'mcq', prompt: 'Vanishing points are placed on the…', options: ['horizon line', 'ground line', 'picture plane', 'station point'], answer: 0, explain: 'VPs always sit on the horizon line (eye level).' },
            { id: 'ep-3', type: 'mcq', prompt: 'The horizon line represents…', options: ['the viewer\'s eye level', 'the ground', 'the top of the object', 'the scale'], answer: 0, explain: 'HL = eye level.' },
            { id: 'ep-4', type: 'mcq', prompt: 'In two-point perspective, vertical edges are drawn…', options: ['vertical', 'to a third VP', 'at 30°', 'dashed'], answer: 0, explain: 'Only horizontal edges go to the VPs; verticals stay vertical.' },
            {
              id: 'ep-5',
              type: 'match',
              prompt: 'Match the abbreviation',
              pairs: [
                ['HL', 'horizon line'],
                ['VP', 'vanishing point'],
                ['SP', 'station point'],
                ['PP', 'picture plane'],
              ],
              explain: 'You\'ll see these labels on every perspective question.',
            },
          ],
        },
      ],
    },
    {
      id: 'e-solid',
      title: 'Solid geometry',
      icon: '🔺',
      description: 'Development, interpenetration, loci, cams, helix',
      lessons: [
        {
          id: 'e-dev',
          title: 'Development',
          teach: {
            text: [
              'A development is the flat shape you cut out and fold to make the solid.',
              'Cylinder side = a rectangle: length = π × d (the circumference), height = h.',
              'Cone side = a sector: angle = (r ÷ L) × 360°, where L is the slant height.',
            ],
            example: ['Cylinder, d = 70', 'length = π × 70 ≈ 219.9 mm', '', 'Cone, r = 30, L = 90', 'angle = 30 ÷ 90 × 360 = 120°'],
          },
          questions: [
            { id: 'ed-1', type: 'mcq', prompt: 'The development of a cylinder\'s curved surface is a…', options: ['rectangle', 'circle', 'sector', 'triangle'], answer: 0, explain: 'Unroll a cylinder → rectangle.' },
            { id: 'ed-2', type: 'input', prompt: 'Cylinder diameter 70 mm. Length of its development to 1 decimal (mm)?', answers: ['219.9'], numeric: true, tolerance: 0.2, explain: 'π × 70 = 219.91… ≈ 219.9 mm.' },
            { id: 'ed-3', type: 'input', prompt: 'Cone: r = 30 mm, slant height L = 90 mm. Sector angle in degrees?', answers: ['120'], numeric: true, explain: '30 ÷ 90 × 360 = 120°.' },
            { id: 'ed-4', type: 'mcq', prompt: 'The development of a cone\'s curved surface is a…', options: ['sector of a circle', 'rectangle', 'square', 'ellipse'], answer: 0, explain: 'A cone unrolls into a sector.' },
            { id: 'ed-5', type: 'input', prompt: 'Cone: r = 40, L = 120. Sector angle in degrees?', answers: ['120'], numeric: true, explain: '40 ÷ 120 × 360 = 120°.' },
          ],
        },
        {
          id: 'e-inter',
          title: 'Interpenetration',
          teach: {
            text: [
              'Interpenetration: two solids pass through each other (e.g. two pipes joining).',
              'The line where their surfaces meet is the line of intersection (curve of interpenetration).',
              'Find it by taking cutting planes (or generators) through both solids and plotting where they meet.',
            ],
          },
          questions: [
            { id: 'ein-1', type: 'mcq', prompt: 'The line where two solids meet is called the…', options: ['line of intersection', 'centre line', 'horizon line', 'base line'], answer: 0, explain: 'Line (or curve) of intersection.' },
            { id: 'ein-2', type: 'mcq', prompt: 'Two cylinders of equal diameter meeting at 90°: the intersection seen from the front is…', options: ['two straight lines', 'a circle', 'a curve that bulges', 'nothing'], answer: 0, explain: 'Equal-diameter cylinders at 90° give straight intersection lines in the front view.' },
            { id: 'ein-3', type: 'mcq', prompt: 'A common method to find points on the line of intersection', options: ['Cutting planes', 'Scaling', 'Hatching', 'Dimensioning'], answer: 0, explain: 'Cutting planes cut both solids; where the cut lines meet is a point on the intersection.' },
            { id: 'ein-4', type: 'mcq', prompt: 'A real-life example of interpenetration', options: ['A T-joint in a water pipe', 'A flat floor tile', 'A bolt', 'A ruler'], answer: 0, explain: 'Pipe joints are classic interpenetration.' },
          ],
        },
        {
          id: 'e-loci',
          title: 'Loci, cams and helix',
          teach: {
            text: [
              'Locus = the path traced by a moving point.',
              'Cam: a shaped disc that turns and pushes a follower up and down.',
              'Displacement graph motions: uniform velocity (straight line), uniform acceleration & retardation (parabolic curve), simple harmonic motion (smooth sine-like curve).',
              'Dwell = the follower stays still. Lift = the maximum rise.',
              'Helix: a point moving around a cylinder AND along it. Pitch = distance along the axis in one full turn.',
            ],
          },
          questions: [
            { id: 'elo-1', type: 'mcq', prompt: 'A locus is…', options: ['the path of a moving point', 'a type of line thickness', 'a scale', 'a section'], answer: 0, explain: 'Locus = path.' },
            { id: 'elo-2', type: 'mcq', prompt: 'On a cam displacement graph, uniform velocity is shown as…', options: ['a straight sloping line', 'a parabola', 'a sine curve', 'a circle'], answer: 0, explain: 'Constant speed → straight line.' },
            { id: 'elo-3', type: 'mcq', prompt: 'The follower stays at the same height for part of the turn. This is called…', options: ['dwell', 'lift', 'pitch', 'stroke'], answer: 0, explain: 'Dwell = no movement.' },
            { id: 'elo-4', type: 'mcq', prompt: 'The pitch of a helix is…', options: ['the distance along the axis in one full turn', 'the diameter', 'the number of turns', 'the angle of the thread'], answer: 0, explain: 'One revolution → moves one pitch along the axis.' },
            {
              id: 'elo-5',
              type: 'match',
              prompt: 'Match the cam motion to its graph shape',
              pairs: [
                ['Uniform velocity', 'straight line'],
                ['Uniform acceleration', 'parabolic curve'],
                ['Simple harmonic motion', 'sine-like curve'],
                ['Dwell', 'horizontal line'],
              ],
              explain: 'Learn these four shapes for cam questions.',
            },
          ],
        },
      ],
    },
    {
      id: 'e-apps',
      title: 'Applied drawings',
      icon: '🏠',
      description: 'Civil, mechanical and electrical',
      lessons: [
        {
          id: 'e-civil',
          title: 'Civil drawing',
          teach: {
            text: [
              'A floor plan is a horizontal section through the building, about 1 m above the floor (through the windows).',
              'Common scales: floor plans 1:100 or 1:50; site plans 1:200 or 1:500.',
              'A door symbol shows which way the door swings.',
              'DPC (damp-proof course) stops moisture rising up the wall.',
              'A north arrow shows how the building faces.',
            ],
          },
          questions: [
            { id: 'ec-1', type: 'mcq', prompt: 'A floor plan is really a…', options: ['horizontal section through the building', 'view from the front', 'view from underneath', '3D drawing'], answer: 0, explain: 'It is cut horizontally, about 1 m up, and seen from above.' },
            { id: 'ec-2', type: 'mcq', prompt: 'DPC stands for…', options: ['damp-proof course', 'door panel cover', 'drawing plan code', 'double plaster coat'], answer: 0, explain: 'Damp-proof course: a layer that stops rising damp.' },
            { id: 'ec-3', type: 'mcq', prompt: 'A typical scale for a house floor plan', options: ['1:100', '1:1', '2:1', '1:5000'], answer: 0, explain: '1:100 (or 1:50) fits a house on the page with readable detail.' },
            { id: 'ec-4', type: 'mcq', prompt: 'The arc drawn at a door opening shows…', options: ['the direction the door swings', 'a window', 'a staircase', 'a wall thickness'], answer: 0, explain: 'The arc = the door swing.' },
            { id: 'ec-5', type: 'mcq', prompt: 'Which symbol shows the orientation of a site?', options: ['North arrow', 'Section line', 'Scale bar', 'Projection symbol'], answer: 0, explain: 'The north arrow.' },
          ],
        },
        {
          id: 'e-mech',
          title: 'Mechanical assembly',
          teach: {
            text: [
              'An assembly drawing shows how parts fit together.',
              'Parts list / item numbers identify each part with a balloon (circle with a number).',
              'Fasteners: bolts, nuts, washers, screws, keys and pins (not hatched when cut lengthwise).',
              'Threads: shown with a thin line for the root (inside) diameter.',
            ],
          },
          questions: [
            { id: 'em-1', type: 'mcq', prompt: 'What does an assembly drawing show?', options: ['How parts fit together', 'Only one part', 'A floor plan', 'An electric circuit'], answer: 0, explain: 'Assembly = parts put together.' },
            { id: 'em-2', type: 'mcq', prompt: 'A small circle with a number pointing to a part is called a…', options: ['balloon (item reference)', 'dimension', 'vanishing point', 'datum'], answer: 0, explain: 'Balloons link parts to the parts list.' },
            { id: 'em-3', type: 'mcq', prompt: 'Which of these is a fastener?', options: ['Nut and bolt', 'Pulley rim', 'Bracket', 'Housing'], answer: 0, explain: 'Fasteners hold parts together.' },
            { id: 'em-4', type: 'mcq', prompt: 'A washer is used to…', options: ['spread the load under a nut or bolt head', 'make a hole', 'show hidden detail', 'transmit electricity'], answer: 0, explain: 'Washers spread the clamping load and protect the surface.' },
          ],
        },
        {
          id: 'e-elec',
          title: 'Electrical diagrams',
          teach: {
            text: [
              'Circuit diagrams use standard symbols, not pictures.',
              'Cell: a long line (+) and a short line (−). A battery is two or more cells.',
              'Lamp: a circle with a cross (×) inside.',
              'Resistor: a rectangle. Switch: a break in the line with a hinged lever.',
              'Series: one path for the current. Parallel: more than one path.',
            ],
          },
          questions: [
            { id: 'eel-1', type: 'mcq', prompt: 'A circle with a cross (×) inside is a…', options: ['lamp', 'resistor', 'cell', 'switch'], answer: 0, explain: 'Lamp symbol.' },
            { id: 'eel-2', type: 'mcq', prompt: 'In a cell symbol, the long line is the…', options: ['positive (+) terminal', 'negative (−) terminal', 'earth', 'fuse'], answer: 0, explain: 'Long line = positive.' },
            { id: 'eel-3', type: 'mcq', prompt: 'A rectangle in a circuit diagram is a…', options: ['resistor', 'lamp', 'battery', 'motor'], answer: 0, explain: 'The rectangle is the resistor symbol.' },
            { id: 'eel-4', type: 'mcq', prompt: 'A circuit with only ONE path for the current is a…', options: ['series circuit', 'parallel circuit', 'short circuit', 'open plan'], answer: 0, explain: 'Series = one path.' },
            { id: 'eel-5', type: 'mcq', prompt: 'In a parallel circuit, if one lamp blows…', options: ['the other lamps stay on', 'all lamps go off', 'the battery explodes', 'the switch opens'], answer: 0, explain: 'Other branches still have a path.' },
          ],
        },
      ],
    },
  ],
}
