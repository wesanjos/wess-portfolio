export async function cmsService({ query }) {
  let response;
  try {
    response = await fetch(`${process.env.BASE_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.DATO_TOKEN}`,
      },
      body: JSON.stringify({
        query,
      }),
    });
  } catch {
    throw new Error(
      'Falha de conexão com o DatoCMS. Verifique BASE_ENDPOINT e a rede.',
    );
  }

  if (!response.ok) {
    throw new Error(`DatoCMS retornou erro HTTP ${response.status}.`);
  }

  let body;
  try {
    body = await response.json();
  } catch {
    throw new Error('DatoCMS retornou uma resposta JSON inválida.');
  }

  if (body.errors?.length) {
    throw new Error(
      'DatoCMS retornou erros GraphQL. Verifique a consulta e as credenciais.',
    );
  }

  return { data: { ...body.data } };
}
