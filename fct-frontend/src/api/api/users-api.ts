/* tslint:disable */
/* eslint-disable */
/**
 * REST API for the website of \"Academia Fabiana Perez\"
 * REST API for the website of \"Academia Fabiana Perez\"
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import type { Configuration } from '../configuration';
import type { AxiosPromise, AxiosInstance, RawAxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from '../common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, type RequestArgs, BaseAPI, RequiredError, operationServerMap } from '../base';
// @ts-ignore
import type { AddUserRequest } from '../models';
// @ts-ignore
import type { ErrorMessage } from '../models';
// @ts-ignore
import type { UpdateUserRequest } from '../models';
// @ts-ignore
import type { User } from '../models';
// @ts-ignore
import type { ValidationErrorMessage } from '../models';
/**
 * UsersApi - axios parameter creator
 * @export
 */
export const UsersApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Add a new user
         * @param {AddUserRequest} addUserRequest User to add
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addUser: async (addUserRequest: AddUserRequest, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'addUserRequest' is not null or undefined
            assertParamExists('addUser', 'addUserRequest', addUserRequest)
            const localVarPath = `/user`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication bearerAuth required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(addUserRequest, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Delete a user
         * @param {number} id User id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteUser: async (id: number, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('deleteUser', 'id', id)
            const localVarPath = `/user/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Get all users
         * @param {string} [usernameOrEmail] The username or email address to filter by.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getAllUsers: async (usernameOrEmail?: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/user`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (usernameOrEmail !== undefined) {
                localVarQueryParameter['usernameOrEmail'] = usernameOrEmail;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Get a user by id
         * @param {number} id User id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getUserById: async (id: number, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('getUserById', 'id', id)
            const localVarPath = `/user/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Update a user
         * @param {number} id User id
         * @param {UpdateUserRequest} updateUserRequest User to update
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateUser: async (id: number, updateUserRequest: UpdateUserRequest, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('updateUser', 'id', id)
            // verify required parameter 'updateUserRequest' is not null or undefined
            assertParamExists('updateUser', 'updateUserRequest', updateUserRequest)
            const localVarPath = `/user/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'PUT', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(updateUserRequest, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * UsersApi - functional programming interface
 * @export
 */
export const UsersApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = UsersApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @summary Add a new user
         * @param {AddUserRequest} addUserRequest User to add
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async addUser(addUserRequest: AddUserRequest, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<User>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.addUser(addUserRequest, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['UsersApi.addUser']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary Delete a user
         * @param {number} id User id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteUser(id: number, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.deleteUser(id, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['UsersApi.deleteUser']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary Get all users
         * @param {string} [usernameOrEmail] The username or email address to filter by.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getAllUsers(usernameOrEmail?: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<User>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getAllUsers(usernameOrEmail, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['UsersApi.getAllUsers']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary Get a user by id
         * @param {number} id User id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getUserById(id: number, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<User>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getUserById(id, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['UsersApi.getUserById']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary Update a user
         * @param {number} id User id
         * @param {UpdateUserRequest} updateUserRequest User to update
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async updateUser(id: number, updateUserRequest: UpdateUserRequest, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<User>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.updateUser(id, updateUserRequest, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['UsersApi.updateUser']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * UsersApi - factory interface
 * @export
 */
export const UsersApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = UsersApiFp(configuration)
    return {
        /**
         * 
         * @summary Add a new user
         * @param {AddUserRequest} addUserRequest User to add
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addUser(addUserRequest: AddUserRequest, options?: RawAxiosRequestConfig): AxiosPromise<User> {
            return localVarFp.addUser(addUserRequest, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Delete a user
         * @param {number} id User id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteUser(id: number, options?: RawAxiosRequestConfig): AxiosPromise<void> {
            return localVarFp.deleteUser(id, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get all users
         * @param {string} [usernameOrEmail] The username or email address to filter by.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getAllUsers(usernameOrEmail?: string, options?: RawAxiosRequestConfig): AxiosPromise<Array<User>> {
            return localVarFp.getAllUsers(usernameOrEmail, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get a user by id
         * @param {number} id User id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getUserById(id: number, options?: RawAxiosRequestConfig): AxiosPromise<User> {
            return localVarFp.getUserById(id, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Update a user
         * @param {number} id User id
         * @param {UpdateUserRequest} updateUserRequest User to update
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateUser(id: number, updateUserRequest: UpdateUserRequest, options?: RawAxiosRequestConfig): AxiosPromise<User> {
            return localVarFp.updateUser(id, updateUserRequest, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * UsersApi - interface
 * @export
 * @interface UsersApi
 */
export interface UsersApiInterface {
    /**
     * 
     * @summary Add a new user
     * @param {AddUserRequest} addUserRequest User to add
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApiInterface
     */
    addUser(addUserRequest: AddUserRequest, options?: RawAxiosRequestConfig): AxiosPromise<User>;

    /**
     * 
     * @summary Delete a user
     * @param {number} id User id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApiInterface
     */
    deleteUser(id: number, options?: RawAxiosRequestConfig): AxiosPromise<void>;

    /**
     * 
     * @summary Get all users
     * @param {string} [usernameOrEmail] The username or email address to filter by.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApiInterface
     */
    getAllUsers(usernameOrEmail?: string, options?: RawAxiosRequestConfig): AxiosPromise<Array<User>>;

    /**
     * 
     * @summary Get a user by id
     * @param {number} id User id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApiInterface
     */
    getUserById(id: number, options?: RawAxiosRequestConfig): AxiosPromise<User>;

    /**
     * 
     * @summary Update a user
     * @param {number} id User id
     * @param {UpdateUserRequest} updateUserRequest User to update
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApiInterface
     */
    updateUser(id: number, updateUserRequest: UpdateUserRequest, options?: RawAxiosRequestConfig): AxiosPromise<User>;

}

/**
 * UsersApi - object-oriented interface
 * @export
 * @class UsersApi
 * @extends {BaseAPI}
 */
export class UsersApi extends BaseAPI implements UsersApiInterface {
    /**
     * 
     * @summary Add a new user
     * @param {AddUserRequest} addUserRequest User to add
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public addUser(addUserRequest: AddUserRequest, options?: RawAxiosRequestConfig) {
        return UsersApiFp(this.configuration).addUser(addUserRequest, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Delete a user
     * @param {number} id User id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public deleteUser(id: number, options?: RawAxiosRequestConfig) {
        return UsersApiFp(this.configuration).deleteUser(id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Get all users
     * @param {string} [usernameOrEmail] The username or email address to filter by.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public getAllUsers(usernameOrEmail?: string, options?: RawAxiosRequestConfig) {
        return UsersApiFp(this.configuration).getAllUsers(usernameOrEmail, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Get a user by id
     * @param {number} id User id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public getUserById(id: number, options?: RawAxiosRequestConfig) {
        return UsersApiFp(this.configuration).getUserById(id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Update a user
     * @param {number} id User id
     * @param {UpdateUserRequest} updateUserRequest User to update
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public updateUser(id: number, updateUserRequest: UpdateUserRequest, options?: RawAxiosRequestConfig) {
        return UsersApiFp(this.configuration).updateUser(id, updateUserRequest, options).then((request) => request(this.axios, this.basePath));
    }
}

