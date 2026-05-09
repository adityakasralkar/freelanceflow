const swaggerJsdoc = require('swagger-jsdoc');

const spec = {
  openapi: '3.0.0',
  info: {
    title: 'FreelanceFlow API',
    version: '1.0.0',
    description:
      'REST API for FreelanceFlow — a Freelance Project & Invoice Management Platform. Built for BITS Pilani FSAD Assignment 2026.',
  },
  servers: [{ url: 'http://localhost:5001/api', description: 'Local dev server' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { type: 'object' },
          message: { type: 'string' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string' },
          code: { type: 'integer' },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string' },
          name: { type: 'string' },
          role: { type: 'string', enum: ['freelancer', 'client'] },
          phone: { type: 'string', nullable: true },
          location: { type: 'string', nullable: true },
          business_name: { type: 'string', nullable: true },
          gst_number: { type: 'string', nullable: true },
          gst_enabled: { type: 'boolean' },
          invoice_prefix: { type: 'string' },
          default_due_days: { type: 'integer' },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      Client: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          freelancer_id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          company: { type: 'string', nullable: true },
          email: { type: 'string', nullable: true },
          phone: { type: 'string', nullable: true },
          location: { type: 'string', nullable: true },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      Proposal: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          freelancer_id: { type: 'string', format: 'uuid' },
          client_id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          description: { type: 'string', nullable: true },
          amount: { type: 'string' },
          status: { type: 'string', enum: ['draft', 'sent', 'accepted', 'declined'] },
          valid_until: { type: 'string', format: 'date', nullable: true },
          payment_terms: { type: 'string', nullable: true },
          deliverables: { type: 'array', items: { type: 'string' } },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      Project: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          proposal_id: { type: 'string', format: 'uuid', nullable: true },
          freelancer_id: { type: 'string', format: 'uuid' },
          client_id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          description: { type: 'string', nullable: true },
          start_date: { type: 'string', format: 'date', nullable: true },
          end_date: { type: 'string', format: 'date', nullable: true },
          total_amount: { type: 'string', nullable: true },
          status: { type: 'string', enum: ['active', 'on_hold', 'completed', 'archived'] },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      Milestone: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          project_id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          description: { type: 'string', nullable: true },
          due_date: { type: 'string', format: 'date', nullable: true },
          amount: { type: 'string' },
          status: { type: 'string', enum: ['upcoming', 'in_progress', 'completed'] },
          completed_at: { type: 'string', format: 'date-time', nullable: true },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      Invoice: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          invoice_number: { type: 'string', example: 'INV-001' },
          project_id: { type: 'string', format: 'uuid', nullable: true },
          milestone_id: { type: 'string', format: 'uuid', nullable: true },
          freelancer_id: { type: 'string', format: 'uuid' },
          client_id: { type: 'string', format: 'uuid' },
          issue_date: { type: 'string', format: 'date' },
          due_date: { type: 'string', format: 'date' },
          subtotal: { type: 'string' },
          tax_amount: { type: 'string' },
          total_amount: { type: 'string' },
          status: { type: 'string', enum: ['draft', 'sent', 'paid', 'overdue'] },
          notes: { type: 'string', nullable: true },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  paths: {
    // ── HEALTH ──────────────────────────────────────────────────────────────
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'API health check',
        responses: {
          200: { description: 'API is running' },
        },
      },
    },

    // ── AUTH ────────────────────────────────────────────────────────────────
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password', 'role'],
                properties: {
                  name: { type: 'string', example: 'Aditya Kasralkar' },
                  email: { type: 'string', example: 'aditya@example.com' },
                  password: { type: 'string', minLength: 6, example: 'secret123' },
                  role: { type: 'string', enum: ['freelancer', 'client'] },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'User registered, returns token + user' },
          409: { description: 'Email already exists' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login and receive JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'aditya@example.com' },
                  password: { type: 'string', example: 'secret123' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login successful, returns token + user' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current logged-in user',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Current user profile' },
          401: { description: 'Unauthorized' },
        },
      },
      patch: {
        tags: ['Auth'],
        summary: 'Update profile / settings',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  phone: { type: 'string' },
                  location: { type: 'string' },
                  business_name: { type: 'string' },
                  gst_enabled: { type: 'boolean' },
                  gst_number: { type: 'string' },
                  business_address: { type: 'string' },
                  invoice_prefix: { type: 'string', example: 'INV-' },
                  default_due_days: { type: 'integer', example: 14 },
                  default_payment_terms: { type: 'string' },
                  upi_id: { type: 'string' },
                  bank_name: { type: 'string' },
                  account_number: { type: 'string' },
                  ifsc_code: { type: 'string' },
                  account_holder_name: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Profile updated' },
          401: { description: 'Unauthorized' },
        },
      },
    },

    // ── CLIENTS ─────────────────────────────────────────────────────────────
    '/clients': {
      get: {
        tags: ['Clients'],
        summary: 'List all clients for the logged-in freelancer',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Array of clients' } },
      },
      post: {
        tags: ['Clients'],
        summary: 'Create a new client',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Rahul Sharma' },
                  company: { type: 'string', example: 'Sharma & Co.' },
                  email: { type: 'string', example: 'rahul@sharma.com' },
                  phone: { type: 'string', example: '+91 98765 43210' },
                  location: { type: 'string', example: 'Mumbai, India' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Client created' } },
      },
    },
    '/clients/{id}': {
      get: {
        tags: ['Clients'],
        summary: 'Get a single client',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 200: { description: 'Client object' }, 404: { description: 'Not found' } },
      },
      patch: {
        tags: ['Clients'],
        summary: 'Update a client',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Client' },
            },
          },
        },
        responses: { 200: { description: 'Client updated' } },
      },
      delete: {
        tags: ['Clients'],
        summary: 'Delete a client',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 200: { description: 'Client deleted' } },
      },
    },

    // ── PROPOSALS ───────────────────────────────────────────────────────────
    '/proposals': {
      get: {
        tags: ['Proposals'],
        summary: 'List all proposals',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['draft', 'sent', 'accepted', 'declined'] } },
        ],
        responses: { 200: { description: 'Array of proposals' } },
      },
      post: {
        tags: ['Proposals'],
        summary: 'Create a proposal',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['client_id', 'title', 'amount'],
                properties: {
                  client_id: { type: 'string', format: 'uuid' },
                  title: { type: 'string', example: 'Website Redesign' },
                  description: { type: 'string' },
                  amount: { type: 'number', example: 75000 },
                  valid_until: { type: 'string', format: 'date' },
                  payment_terms: { type: 'string' },
                  deliverables: { type: 'array', items: { type: 'string' } },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Proposal created' } },
      },
    },
    '/proposals/{id}': {
      get: {
        tags: ['Proposals'],
        summary: 'Get a single proposal',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 200: { description: 'Proposal object' } },
      },
      patch: {
        tags: ['Proposals'],
        summary: 'Update a proposal',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Proposal' } } },
        },
        responses: { 200: { description: 'Proposal updated' } },
      },
      delete: {
        tags: ['Proposals'],
        summary: 'Delete a draft proposal',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 200: { description: 'Proposal deleted' }, 400: { description: 'Can only delete draft proposals' } },
      },
    },
    '/proposals/{id}/status': {
      patch: {
        tags: ['Proposals'],
        summary: 'Advance proposal status (state machine)',
        description: 'Valid transitions: draft→sent, sent→accepted, sent→declined',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', enum: ['sent', 'accepted', 'declined'] },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Status updated' },
          400: { description: 'Invalid status transition' },
        },
      },
    },
    '/proposals/{id}/convert': {
      post: {
        tags: ['Proposals'],
        summary: 'Convert an accepted proposal into a project',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          201: { description: 'Project created from proposal' },
          400: { description: 'Proposal must be accepted first' },
        },
      },
    },

    // ── PROJECTS ────────────────────────────────────────────────────────────
    '/projects': {
      get: {
        tags: ['Projects'],
        summary: 'List all projects',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['active', 'on_hold', 'completed', 'archived'] } },
        ],
        responses: { 200: { description: 'Array of projects' } },
      },
    },
    '/projects/{id}': {
      get: {
        tags: ['Projects'],
        summary: 'Get a single project with client and proposal details',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 200: { description: 'Project object' } },
      },
      patch: {
        tags: ['Projects'],
        summary: 'Update a project',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  status: { type: 'string', enum: ['active', 'on_hold', 'completed', 'archived'] },
                  end_date: { type: 'string', format: 'date' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Project updated' } },
      },
    },

    // ── MILESTONES ──────────────────────────────────────────────────────────
    '/projects/{projectId}/milestones': {
      get: {
        tags: ['Milestones'],
        summary: 'List milestones for a project',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'projectId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 200: { description: 'Array of milestones' } },
      },
      post: {
        tags: ['Milestones'],
        summary: 'Add a milestone to a project',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'projectId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'amount'],
                properties: {
                  title: { type: 'string', example: 'Design Mockups' },
                  description: { type: 'string' },
                  due_date: { type: 'string', format: 'date' },
                  amount: { type: 'number', example: 25000 },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Milestone created' } },
      },
    },
    '/milestones/{id}': {
      patch: {
        tags: ['Milestones'],
        summary: 'Update a milestone',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  due_date: { type: 'string', format: 'date' },
                  amount: { type: 'number' },
                  status: { type: 'string', enum: ['upcoming', 'in_progress', 'completed'] },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Milestone updated' } },
      },
    },
    '/milestones/{id}/complete': {
      patch: {
        tags: ['Milestones'],
        summary: 'Mark a milestone as complete',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'Milestone marked complete. Response includes can_generate_invoice flag.' },
        },
      },
    },

    // ── INVOICES ────────────────────────────────────────────────────────────
    '/invoices': {
      get: {
        tags: ['Invoices'],
        summary: 'List all invoices',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['draft', 'sent', 'paid', 'overdue'] } },
        ],
        responses: { 200: { description: 'Array of invoices' } },
      },
    },
    '/invoices/{id}': {
      get: {
        tags: ['Invoices'],
        summary: 'Get a single invoice with line items',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 200: { description: 'Invoice with items, client, project details' } },
      },
    },
    '/invoices/generate/{milestoneId}': {
      post: {
        tags: ['Invoices'],
        summary: 'Auto-generate an invoice from a completed milestone',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'milestoneId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  notes: { type: 'string' },
                  due_date: { type: 'string', format: 'date' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Invoice generated with auto-incremented invoice number' },
          400: { description: 'Milestone not completed or invoice already exists' },
        },
      },
    },
    '/invoices/{id}/status': {
      patch: {
        tags: ['Invoices'],
        summary: 'Update invoice status (state machine)',
        description: 'Valid transitions: draft→sent, sent→paid, sent→overdue',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', enum: ['sent', 'paid', 'overdue'] },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Status updated' },
          400: { description: 'Invalid status transition' },
        },
      },
    },

    // ── CLIENT PORTAL ───────────────────────────────────────────────────────
    '/client-portal/my-projects': {
      get: {
        tags: ['Client Portal'],
        summary: 'Client: list their own projects (read-only)',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Projects belonging to the logged-in client' } },
      },
    },
    '/client-portal/my-projects/{id}': {
      get: {
        tags: ['Client Portal'],
        summary: 'Client: get project detail with milestones',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 200: { description: 'Project detail' } },
      },
    },
    '/client-portal/my-invoices': {
      get: {
        tags: ['Client Portal'],
        summary: 'Client: list their own invoices',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Invoices belonging to the logged-in client' } },
      },
    },
    '/client-portal/my-invoices/{id}': {
      get: {
        tags: ['Client Portal'],
        summary: 'Client: get invoice detail with line items',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 200: { description: 'Invoice detail' } },
      },
    },
    '/client-portal/my-invoices/{id}/acknowledge': {
      patch: {
        tags: ['Client Portal'],
        summary: 'Client: acknowledge / confirm receipt of an invoice',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'Invoice acknowledged' },
          400: { description: 'Invoice must be in sent status' },
        },
      },
    },
  },
};

module.exports = spec;
