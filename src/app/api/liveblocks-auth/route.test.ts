import { auth, currentUser } from '@clerk/nextjs/server';
import { Liveblocks } from '@liveblocks/node';
import { ConvexHttpClient } from 'convex/browser';
import { NextRequest, NextResponse } from 'next/server';

import { POST } from './route';

// src/app/api/liveblocks-auth/route.test.ts

// Mock external dependencies
jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
  currentUser: jest.fn(),
}));

jest.mock('convex/browser', () => ({
  ConvexHttpClient: jest.fn(),
}));

jest.mock('@liveblocks/node', () => {
  const mockLiveblocksInstance = {
    prepareSession: jest.fn(),
  };

  return {
    Liveblocks: jest.fn(() => mockLiveblocksInstance),
  };
});

jest.mock('@/../convex/_generated/api', () => ({
  api: {
    documents: {
      getById: 'documents/getById',
    },
  },
}));

// Mock Next.js Response
jest.mock('next/server', () => {
  const originalModule = jest.requireActual('next/server');
  return {
    ...originalModule,
    NextResponse: {
      ...originalModule.NextResponse,
      json: jest.fn((body) => ({ body, status: 200 })),
      constructor: jest.fn((body, options) => ({ body, status: options?.status || 200 })),
    },
  };
});

describe('Liveblocks Auth Route Handler', () => {
  let mockRequest: NextRequest;
  let mockSession: any;
  let mockConvexInstance: any;
  let mockLiveblocksInstance: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock request object
    mockRequest = {
      json: jest.fn().mockResolvedValue({ room: 'room-id' }),
    } as unknown as NextRequest;

    // Mock ConvexHttpClient instance
    mockConvexInstance = {
      query: jest.fn(),
    };
    (ConvexHttpClient as jest.Mock).mockImplementation(() => mockConvexInstance);

    // Mock Liveblocks instance and session
    mockSession = {
      allow: jest.fn().mockReturnThis(),
      FULL_ACCESS: 'full-access',
      authorize: jest.fn().mockResolvedValue({ body: 'session-data', status: 200 }),
    };
    mockLiveblocksInstance = (Liveblocks as jest.Mock).mock.results[0]?.value || {
      prepareSession: jest.fn().mockReturnValue(mockSession),
    };
    mockLiveblocksInstance.prepareSession = jest.fn().mockReturnValue(mockSession);

    // Mock NextResponse
    (NextResponse as any) = jest.fn().mockImplementation((body, options) => ({
      body,
      status: options?.status || 200,
    }));
  });

  test('should return 401 when user is not authenticated', async () => {
    // Setup mocks to simulate unauthenticated user
    (auth as unknown as jest.Mock).mockResolvedValue({ sessionClaims: null });
    (currentUser as jest.Mock).mockResolvedValue(null);

    const response = await POST(mockRequest);

    expect(response.status).toBe(401);
    expect(response.body).toBe('Unauthorized!');
  });

  test('should return 401 when document does not exist', async () => {
    // Setup mocks with authenticated user but no document
    (auth as unknown as jest.Mock).mockResolvedValue({ sessionClaims: { userId: 'user-1' } });
    (currentUser as jest.Mock).mockResolvedValue({
      id: 'user-1',
      fullName: 'Test User',
      imageUrl: 'https://example.com/avatar.png',
    });
    mockConvexInstance.query.mockResolvedValue(null);

    const response = await POST(mockRequest);

    expect(response.status).toBe(401);
    expect(response.body).toBe('Unauthorized!');
    expect(mockConvexInstance.query).toHaveBeenCalledWith('documents/getById', { id: 'room-id' });
  });

  test('should return 401 when user has no permission to access document', async () => {
    // Setup mocks with authenticated user but no permission
    (auth as unknown as jest.Mock).mockResolvedValue({
      sessionClaims: {
        userId: 'user-1',
        o: { id: 'org-2' },
      },
    });
    (currentUser as jest.Mock).mockResolvedValue({
      id: 'user-1',
      fullName: 'Test User',
      imageUrl: 'https://example.com/avatar.png',
    });
    mockConvexInstance.query.mockResolvedValue({
      ownerId: 'user-2', // Different user
      organizationId: 'org-1', // Different org
    });

    const response = await POST(mockRequest);

    expect(response.status).toBe(401);
    expect(response.body).toBe('Unauthorized!');
  });

  test('should authorize when user is document owner', async () => {
    // Setup mocks with user as document owner
    (auth as unknown as jest.Mock).mockResolvedValue({
      sessionClaims: {
        userId: 'user-1',
        o: { id: 'org-2' },
      },
    });
    (currentUser as jest.Mock).mockResolvedValue({
      id: 'user-1',
      fullName: 'Test User',
      imageUrl: 'https://example.com/avatar.png',
    });
    mockConvexInstance.query.mockResolvedValue({
      ownerId: 'user-1', // Same as user id
      organizationId: 'org-1',
    });

    await POST(mockRequest);

    expect(mockLiveblocksInstance.prepareSession).toHaveBeenCalledWith('user-1', {
      userInfo: {
        name: 'Test User',
        avatar: 'https://example.com/avatar.png',
        color: expect.any(String),
      },
    });
    expect(mockSession.allow).toHaveBeenCalledWith('room-id', 'full-access');
    expect(mockSession.authorize).toHaveBeenCalled();
  });

  test('should authorize when user is organization member', async () => {
    // Setup mocks with user as organization member
    (auth as unknown as jest.Mock).mockResolvedValue({
      sessionClaims: {
        userId: 'user-1',
        o: { id: 'org-1' },
      },
    });
    (currentUser as jest.Mock).mockResolvedValue({
      id: 'user-1',
      fullName: 'Test User',
      imageUrl: 'https://example.com/avatar.png',
    });
    mockConvexInstance.query.mockResolvedValue({
      ownerId: 'user-2', // Different user
      organizationId: 'org-1', // Same organization
    });

    await POST(mockRequest);

    expect(mockLiveblocksInstance.prepareSession).toHaveBeenCalledWith('user-1', expect.any(Object));
    expect(mockSession.allow).toHaveBeenCalledWith('room-id', 'full-access');
  });

  test('should use email as name when fullName is not available', async () => {
    // Setup mocks with email instead of fullName
    (auth as unknown as jest.Mock).mockResolvedValue({
      sessionClaims: { userId: 'user-1' },
    });
    (currentUser as jest.Mock).mockResolvedValue({
      id: 'user-1',
      fullName: null,
      primaryEmailAddress: {
        emailAddress: 'user@example.com',
      },
      imageUrl: 'https://example.com/avatar.png',
    });
    mockConvexInstance.query.mockResolvedValue({
      ownerId: 'user-1',
      organizationId: null,
    });

    await POST(mockRequest);

    expect(mockLiveblocksInstance.prepareSession).toHaveBeenCalledWith('user-1', {
      userInfo: {
        name: 'user@example.com',
        avatar: 'https://example.com/avatar.png',
        color: expect.any(String),
      },
    });
  });

  test('should use "Anonymous" as name when no name or email is available', async () => {
    // Setup mocks with no name or email
    (auth as unknown as jest.Mock).mockResolvedValue({
      sessionClaims: { userId: 'user-1' },
    });
    (currentUser as jest.Mock).mockResolvedValue({
      id: 'user-1',
      fullName: null,
      primaryEmailAddress: null,
      imageUrl: 'https://example.com/avatar.png',
    });
    mockConvexInstance.query.mockResolvedValue({
      ownerId: 'user-1',
      organizationId: null,
    });

    await POST(mockRequest);

    expect(mockLiveblocksInstance.prepareSession).toHaveBeenCalledWith('user-1', {
      userInfo: {
        name: 'Anonymous',
        avatar: 'https://example.com/avatar.png',
        color: expect.any(String),
      },
    });
  });

  test('should return response from liveblocks session authorization', async () => {
    // Setup successful authorization
    (auth as unknown as jest.Mock).mockResolvedValue({
      sessionClaims: { userId: 'user-1' },
    });
    (currentUser as jest.Mock).mockResolvedValue({
      id: 'user-1',
      fullName: 'Test User',
      imageUrl: 'https://example.com/avatar.png',
    });
    mockConvexInstance.query.mockResolvedValue({
      ownerId: 'user-1',
      organizationId: null,
    });
    mockSession.authorize.mockResolvedValue({
      body: 'authorized-session-data',
      status: 201,
    });

    const response = await POST(mockRequest);

    expect(response.body).toBe('authorized-session-data');
    expect(response.status).toBe(201);
  });
});
