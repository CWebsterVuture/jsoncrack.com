import useStored from "src/store/useStored";
export const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

// Example taken from https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json
const sampleJson = Object.freeze({
  squadName: "Super hero squad",
  homeTown: "Metro City",
  formed: 2016,
  secretBase: "Super tower",
  active: true,
  members: [
    {
      name: "Molecule Man",
      age: 29,
      secretIdentity: "Dan Jukes",
      powers: ["Radiation resistance", "Turning tiny", "Radiation blast"],
    },
    {
      name: "Madame Uppercut",
      age: 39,
      secretIdentity: "Jane Wilson",
      powers: ["Million tonne punch", "Damage resistance", "Superhuman reflexes"],
    },
    {
      name: "Eternal Flame",
      age: 1000000,
      secretIdentity: "Unknown",
      powers: [
        "Immortality",
        "Heat Immunity",
        "Inferno",
        "Teleportation",
        "Interdimensional travel",
      ],
    },
  ],
});

const yaml = `
---
 doe: "a deer, a female deer"
 ray: "a drop of golden sun"
 pi: 3.14159
 xmas: true
 french-hens: 3
 calling-birds:
   - huey
   - dewey
   - louie
   - fred
 xmas-fifth-day:
   calling-birds: four
   french-hens: 3
   golden-rings: 5
   partridges:
     count: 1
     location: "a pear tree"
   turtle-doves: two
`;

export const defaultJson = JSON.stringify(sampleJson, null, 2);
export const defaultYaml = yaml;

export const getDefaultData = () => {
  let editorLanguage = useStored.getState().editorLanguage;
  switch(editorLanguage){
    case "yaml":
      return defaultYaml;
    case "json":
    default:
      return defaultJson;
  }
}