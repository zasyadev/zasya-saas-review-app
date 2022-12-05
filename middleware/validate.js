export async function validate(schema, body) {
  return await schema.validate(body, { abortEarly: false, stripUnknown: true });
}
