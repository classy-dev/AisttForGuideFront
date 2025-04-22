import styled from '@emotion/styled';

const LoginWrapStyle = styled.div`
  position: fixed;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: Pretendard, sans-serif;
  background: #f7f7fe;
  color: #5a6376;
  overflow: auto;
  justify-content: center;

  h2 {
    font-weight: bold;
    text-align: center;
    margin-bottom: 3rem;
    font-size: 2.4rem;
    color: #5a6376;
  }

  hr {
    margin: 0;
    opacity: 1;
    background: #c9c9c9;
    border-color: #c9c9c9;
  }

  .login {
    width: 100%;
    height: calc(100vh - 6rem);
    display: flex;
    overflow-y: auto;
    flex-direction: column;

    &__header {
      display: flex;
      height: 6rem;
      justify-content: space-between;
      align-items: center;
      background: var(--color-primary);
    }

    &__symbol {
      margin-left: 1.9rem;
      width: auto;
      height: auto;
    }

    &__logo {
      text-align: center;
      z-index: 1;

      img {
        display: inline-block;
        width: 100%;
        max-width: 30.6rem;
      }
    }

    &__action {
      display: flex;
      justify-content: space-between;
      margin: 3.1rem 0 8rem;

      button {
        width: 100%;
        background: #171c8f;
        color: #fff;
        font-size: 1.7rem;
        font-weight: 500;
        padding: 1.6rem;
        height: 5.5rem;
        &:hover {
          background: #171c8f;
          color: #fff;
        }
      }
    }

    &__guide {
      display: flex;
      justify-content: space-between;
      padding: 0 0.8rem;
      font-size: 1.2rem;
      line-height: 1.4;
      color: #5a6376;
      font-weight: 400;

      a {
        color: inherit;
        cursor: pointer;

        &:hover {
          color: inherit;
        }
      }
    }

    &__content {
      position: relative;
      display: flex;
      flex-direction: column;
    }

    &__card {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 44rem;
      margin: 6.4rem auto 4.2rem;
      padding: 0 2.8rem 2.8rem;
      border-radius: 0.8rem;
    }

    &__input-wrapper {
      margin-bottom: 3.1rem;

      input {
        height: 5rem !important;
        padding: 0 1.6rem;
        font-size: 1.4rem;

        &::placeholder {
          color: #aeaeae;
        }
      }

      .gv-form-field {
        border-radius: 4px;
      }

      .gv-form-field:focus-within {
        border-color: #181818;
        box-shadow: none;
      }
    }

    &__label {
      font-size: 1.6rem;
      font-weight: 600;
      line-height: 1.2;
      padding: 0;
      margin-bottom: 0.9rem;
    }
  }

  @media (max-width: 76.8rem) {
    .login__logo {
      position: static;
      display: flex;
      justify-content: center;
      margin-top: 3.5rem;

      img {
        max-width: 20.3rem;
      }
    }

    .login__content {
      flex: none;
    }

    .login__card {
      margin-top: 3.2rem;
    }
  }
`;

const LoginPage = () => {
  return <LoginWrapStyle></LoginWrapStyle>;
};

export default LoginPage;
