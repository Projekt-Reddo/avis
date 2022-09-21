import * as yup from "yup";
import { AnyObject, Maybe } from "yup/lib/types";

const REGEX_PASSWORD = /^[a-zA-Z0-9!@#$%^&*_-]{6,32}$/;
const REGEX_NAME = /^(?![\s.]+$)[a-zA-Z\s.]*$/;
const REGEX_ONLY_NUMBER = /^\d+$/;

yup.addMethod<yup.StringSchema>(yup.string, "password", function (message) {
    return this.matches(REGEX_PASSWORD, {
        message,
        excludeEmptyString: true,
    });
});

yup.addMethod<yup.StringSchema>(yup.string, "onlyNumber", function (message) {
    return this.matches(REGEX_ONLY_NUMBER, {
        message,
        excludeEmptyString: true,
    });
});

yup.addMethod<yup.StringSchema>(yup.string, "name", function (message) {
    return this.matches(REGEX_NAME, {
        message,
        excludeEmptyString: true,
    });
});

declare module "yup" {
    interface StringSchema<
        TType extends Maybe<string> = string | undefined,
        TContext extends AnyObject = AnyObject,
        TOut extends TType = TType
    > extends yup.BaseSchema<TType, TContext, TOut> {
        password(message: string): StringSchema<TType, TContext>;
        name(message: string): StringSchema<TType, TContext>;
    }

    interface NumberSchema<
        TType extends Maybe<number> = number | undefined,
        TContext extends AnyObject = AnyObject,
        TOut extends TType = TType
    > extends yup.BaseSchema<TType, TContext, TOut> {}
}

export default yup;
