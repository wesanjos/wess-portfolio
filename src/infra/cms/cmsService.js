export async function cmsService({ query }) {
  try {
    const responsePage = await fetch(`${process.env.BASE_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.DATO_TOKEN}`,
      },
      body: JSON.stringify({
        query,
      }),
    }).then(async (response) => {
      const body = await response.json();

      if (!body.errors) return body;

      throw new Error(JSON.stringify(body));
    });

    return {
      data: {
        ...responsePage.data,
      },
    };
  } catch (error) {
    throw new Error(error.message);
  }
}
