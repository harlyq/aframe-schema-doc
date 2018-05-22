AFRAME.registerComponent("test", {
  schema: {
    alpha: {
      type: "int",
      description: "define the transparency of the subject (%)",
    },
    beta: {
      default: 10,
      if: {gamma: ["a","c"]},
      description: "the maximum intensity",
    },
    gamma: {
      default: "a",
      oneOf: ["a", "b", "c"],
      description: "defines the type of system to use",
    }
  }
})
