function errorHandler(err, req, res, next) {
  console.error(err);

  // Zod validation errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Prisma unique constraint violation
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Resource already exists' });
  }

  res.status(500).json({ error: 'Internal server error' });
}

export { errorHandler };