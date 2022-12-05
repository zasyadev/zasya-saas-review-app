const getErrors = (errorsList) => {
  const formErrors = errorsList.map((errObj) => errObj.message);

  const errorNode = (
    <div>
      {formErrors.map((error, i) => (
        <p className="mb-1" key={i}>
          {error}
        </p>
      ))}
    </div>
  );

  return errorNode;
};

export default getErrors;
