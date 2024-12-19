import {Injectable} from '@nestjs/common';
import KeycloakAdminClient from "@keycloak/keycloak-admin-client";
import axios from "axios";

@Injectable()
export class KeycloakService {

    private keycloakAdminClient: KeycloakAdminClient;

    constructor() {
        this.keycloakAdminClient = new KeycloakAdminClient({
            baseUrl: 'http://localhost:8080',
            realmName: 'geofocus-realm',
        });
    }

    async authenticateAdmin() {
        try {
            await this.keycloakAdminClient.auth({
                clientId: 'user-manage-client',
                grantType: 'client_credentials',
                clientSecret: 'IIRUXyJMTaBZP4yh01bttzZsdMe4CdxM'
            });
        } catch (error) {
            console.error('Keycloak admin authentication failed', error);
            throw error;
        }
    }

    async getUsers(): Promise<any[]> {
        try {
            await this.authenticateAdmin();
            return await this.keycloakAdminClient.users.find({realm: 'geofocus-realm'});
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    async getUser(userId: string): Promise<any> {
        try {
            await this.authenticateAdmin();
            return await this.keycloakAdminClient.users.findOne({id: userId});
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    async addRolesToUser(userId: string, roleNames: string[]) {
        try {
            await this.authenticateAdmin();

            const allRoles = await this.keycloakAdminClient.roles.find();
            const rolesToAdd = allRoles
                .filter(role => roleNames.includes(role.name))
                .map(role => ({id: role.id, name: role.name})); // Map to RoleMappingPayload

            if (rolesToAdd.length === 0) {
                throw new Error('No matching roles found to add');
            }

            await this.keycloakAdminClient.users.addRealmRoleMappings({
                id: userId,
                roles: rolesToAdd,
            });

            console.log('Roles added successfully:', rolesToAdd);
            return {message: 'Roles added successfully'};
        } catch (error) {
            console.error('Error adding roles:', error.response?.data || error.message);
            throw error;
        }
    }

    async deleteRolesFromUser(userId: string, roleNames: string[]) {
        try {
            await this.authenticateAdmin();

            const allRoles = await this.keycloakAdminClient.roles.find();
            const rolesToDelete = allRoles
                .filter(role => roleNames.includes(role.name))
                .map(role => ({id: role.id, name: role.name})); // Map to RoleMappingPayload

            if (rolesToDelete.length === 0) {
                throw new Error('No matching roles found to delete');
            }

            await this.keycloakAdminClient.users.delRealmRoleMappings({
                id: userId,
                roles: rolesToDelete,
            });

            console.log('Roles deleted successfully:', rolesToDelete);
            return {message: 'Roles deleted successfully'};
        } catch (error) {
            console.error('Error deleting roles:', error.response?.data || error.message);
            throw error;
        }
    }

    async deleteUser(userId: string) {
        try {
            await this.authenticateAdmin(); // Authenticate the admin client

            await this.keycloakAdminClient.users.del({
                id: userId, // Keycloak User ID to delete
            });

            console.log('User deleted successfully:', userId);
            return {message: 'User deleted successfully'};
        } catch (error) {
            console.error('Error deleting user:', error.response?.data || error.message);
            throw error;
        }
    }

    async createUserWithRolesAndPassword(userData: {
        username: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        enabled?: boolean;
        password: string;
        roles: string[];
    }) {
        try {
            await this.authenticateAdmin();

            const createdUser = await this.keycloakAdminClient.users.create({
                username: userData.username,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                enabled: userData.enabled ?? true,
            });

            console.log('User created successfully:', createdUser.id);

            await this.keycloakAdminClient.users.resetPassword({
                id: createdUser.id,
                credential: {
                    type: 'password',
                    value: userData.password,
                    temporary: false,
                },
            });

            console.log('Password set successfully for user:', userData.username);

            if (userData.roles && userData.roles.length > 0) {
                const allRoles = await this.keycloakAdminClient.roles.find(); // Fetch all roles from Keycloak
                const rolesToAssign = allRoles
                    .filter(role => userData.roles.includes(role.name)) // Match roles by name
                    .map(role => ({id: role.id, name: role.name})); // Transform to RoleMappingPayload

                if (rolesToAssign.length > 0) {
                    await this.keycloakAdminClient.users.addRealmRoleMappings({
                        id: createdUser.id,
                        roles: rolesToAssign, // Pass RoleMappingPayload[]
                    });
                    console.log('Roles assigned successfully:', userData.roles);
                } else {
                    console.warn('No matching roles found to assign');
                }
            }

            return {userId: createdUser.id};
        } catch (error) {
            console.error('Error creating user with roles and password:', error);
            throw error;
        }
    }

    async introspectToken(token: string) {

        if (typeof token !== 'string') {
            console.error('Invalid token type:', typeof token, token);
            throw new Error('Token must be a string');
        }

        const introspectionUrl = `http://localhost:8080/realms/geofocus-realm/protocol/openid-connect/token/introspect`;

        try {
            const response = await axios.post(
                introspectionUrl,
                new URLSearchParams({
                    token: token,
                    client_id: 'user-manage-client',
                    client_secret: 'IIRUXyJMTaBZP4yh01bttzZsdMe4CdxM',
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                },
            );
            return response.data;
        } catch (error) {
            console.error('Error introspecting token', error.response?.data || error.message);
            throw error;
        }
    }
}