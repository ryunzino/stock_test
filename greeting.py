def greet(name: str) -> str:
    return f"안녕하세요, {name}님! 반갑습니다."


def main():
    name = input("이름을 입력하세요: ")
    print(greet(name))


if __name__ == "__main__":
    main()
