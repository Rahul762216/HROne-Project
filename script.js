function createFieldGroup(container) {
  const fieldWrapper = document.createElement("div");
  fieldWrapper.className = "field-group";

  const field = document.createElement("div");
  field.className = "field";

  const keyInput = document.createElement("input");
  keyInput.placeholder = "Field Key";

  const typeSelect = document.createElement("select");
  ["string", "number", "nested"].forEach((type) => {
    const opt = document.createElement("option");
    opt.value = type;
    opt.textContent = type;
    typeSelect.appendChild(opt);
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = () => fieldWrapper.remove();

  field.appendChild(keyInput);
  field.appendChild(typeSelect);
  field.appendChild(deleteBtn);
  fieldWrapper.appendChild(field);

  const nestedContainer = document.createElement("div");
  nestedContainer.className = "nested-container";

  const addNestedBtn = document.createElement("button");
  addNestedBtn.textContent = "+ Add Nested Field";
  addNestedBtn.className = "add-btn";
  addNestedBtn.onclick = () => createFieldGroup(nestedContainer);

  typeSelect.onchange = () => {
    if (typeSelect.value === "nested") {
      fieldWrapper.appendChild(addNestedBtn);
      fieldWrapper.appendChild(nestedContainer);
    } else {
      addNestedBtn.remove();
      nestedContainer.innerHTML = "";
      nestedContainer.remove();
    }
  };

  const addFieldBtn = document.createElement("button");
  addFieldBtn.textContent = "+ Add Field";
  addFieldBtn.className = "add-btn";
  addFieldBtn.onclick = () => createFieldGroup(container);

  fieldWrapper.appendChild(addFieldBtn);
  container.appendChild(fieldWrapper);
}

function generateSchema() {
  const builder = document.getElementById("builder");
  const schema = {
    type: "object",
    properties: getFields(builder),
  };
  document.getElementById("output").textContent = JSON.stringify(
    schema,
    null,
    2
  );
}

function getFields(container) {
  const result = {};
  const groups = container.querySelectorAll(":scope > .field-group");

  groups.forEach((group) => {
    const key = group.querySelector("input").value.trim();
    const type = group.querySelector("select").value;

    if (!key) return;

    if (type === "nested") {
      const nested = group.querySelector(".nested-container");
      result[key] = {
        type: "object",
        properties: getFields(nested),
      };
    } else {
      result[key] = { type };
    }
  });

  return result;
}

// Initialize
const builder = document.getElementById("builder");
createFieldGroup(builder);
