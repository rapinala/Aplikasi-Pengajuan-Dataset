import { pgTable, text, serial, timestamp, varchar, integer, jsonb, boolean, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const userRoleEnum = pgEnum('user_role', ['instansi', 'walidata', 'admin']);
export const datasetStatusEnum = pgEnum('dataset_status', ['draft', 'pending', 'validated', 'rejected', 'published']);
export const notificationTypeEnum = pgEnum('notification_type', ['submission', 'validation', 'rejection', 'comment']);
export const dataClassificationEnum = pgEnum('data_classification', ['publik', 'terbatas', 'rahasia']);

// Users Table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  role: userRoleEnum('role').notNull().default('instansi'),
  instansiId: integer('instansi_id'),
  avatar: text('avatar'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Instansi Table
export const instansi = pgTable('instansi', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  category: varchar('category', { length: 100 }),
  address: text('address'),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  website: text('website'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Dataset Categories
export const datasetCategories = pgTable('dataset_categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  icon: varchar('icon', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Datasets Table
export const datasets = pgTable('datasets', {
  id: serial('id').primaryKey(),
  
  // Basic Info
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description').notNull(),
  
  // Metadata
  concept: text('concept'),
  definition: text('definition'),
  interpretasi: text('interpretasi'),
  metodologi: text('metodologi'),
  unitData: varchar('unit_data', { length: 100 }),
  periodStart: varchar('period_start', { length: 50 }),
  periodEnd: varchar('period_end', { length: 50 }),
  updateFrequency: varchar('update_frequency', { length: 100 }),
  
  // Classification
  categoryId: integer('category_id'),
  classification: dataClassificationEnum('classification').notNull().default('publik'),
  tags: jsonb('tags').$type<string[]>().default([]),
  
  // File Info
  fileName: varchar('file_name', { length: 500 }),
  fileSize: integer('file_size'),
  fileType: varchar('file_type', { length: 50 }),
  fileUrl: text('file_url'),
  
  // Status & Ownership
  status: datasetStatusEnum('status').notNull().default('draft'),
  submittedBy: integer('submitted_by').notNull(),
  instansiId: integer('instansi_id').notNull(),
  validatedBy: integer('validated_by'),
  validatedAt: timestamp('validated_at'),
  rejectionReason: text('rejection_reason'),
  
  // Additional Metadata
  dataDictionary: jsonb('data_dictionary').$type<Array<{
    field: string;
    type: string;
    description: string;
    example?: string;
  }>>(),
  
  // Stats
  downloadCount: integer('download_count').default(0),
  viewCount: integer('view_count').default(0),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  publishedAt: timestamp('published_at'),
});

// Forum/Discussion Table
export const discussions = pgTable('discussions', {
  id: serial('id').primaryKey(),
  datasetId: integer('dataset_id').notNull(),
  userId: integer('user_id').notNull(),
  message: text('message').notNull(),
  isInternal: boolean('is_internal').default(false), // internal = hanya walidata & instansi terkait
  parentId: integer('parent_id'), // untuk reply
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Notifications Table
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  type: notificationTypeEnum('type').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  datasetId: integer('dataset_id'),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Activity Logs
export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  action: varchar('action', { length: 100 }).notNull(),
  description: text('description').notNull(),
  datasetId: integer('dataset_id'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Data Quality Metrics
export const dataQualityMetrics = pgTable('data_quality_metrics', {
  id: serial('id').primaryKey(),
  datasetId: integer('dataset_id').notNull(),
  completenessScore: integer('completeness_score'), // 0-100
  accuracyScore: integer('accuracy_score'), // 0-100
  timelinessScore: integer('timeliness_score'), // 0-100
  consistencyScore: integer('consistency_score'), // 0-100
  overallScore: integer('overall_score'), // 0-100
  assessedBy: integer('assessed_by'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Instansi = typeof instansi.$inferSelect;
export type Dataset = typeof datasets.$inferSelect;
export type NewDataset = typeof datasets.$inferInsert;
export type Discussion = typeof discussions.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type ActivityLog = typeof activityLogs.$inferSelect;
