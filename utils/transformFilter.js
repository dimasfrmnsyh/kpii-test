const filterDataByField = require("./filterDataByField");


const validationFeld = async (data, field) => {
  const validator = yup.object(filterDataByField(checkField, field));
  const result = await validator.validate(data);
  return result;
};

const transformFilter = async (
  fieldName,
  fieldValue,
  filterType,
  isAggregate
) => {
  try {
    let response;

    const fieldNameSplit = fieldName.split(".");
    const firstFieldName = fieldNameSplit[0];
    const secondFieldName = fieldNameSplit[1];
    if (firstFieldName === "invoice") {
      response = [fieldName, fieldValue, filterType];
    } else if (fieldNameSplit.length === 1) {
      response = [fieldName, fieldValue, filterType];
    } else if (fieldNameSplit.length === 2 && isAggregate) {
      response = [fieldName, fieldValue, filterType];
    } else if (fieldNameSplit.length === 2 && secondFieldName === "_id") {
      response = [firstFieldName, fieldValue, filterType];
    } else if (fieldNameSplit.length === 2 && secondFieldName !== "_id") {
      let newFieldValue = fieldValue;
      let data = [];

      await validationFeld({ [secondFieldName]: fieldValue }, [
        secondFieldName,
      ]);
    }
    return response;
  } catch (e) {
    throw new Error(`transformFilter ${e.message}`);
  }
};

module.exports = transformFilter;
