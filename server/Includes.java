public class Includes {
    public static void main(String[] args) {
        String string = "praveen";
        String query = "aeen";

        System.out.println(isSubStringOf(string, query));
    }

    public static boolean isSubStringOf(String string, String query) {
        int n = string.length();
        int m = query.length();

        for (int i = 0; i < n; i++) {
            int j = 0;

            while (i < n && j < m && string.charAt(i + j) == query.charAt(j)) {
                j++;
            }

            if (j == m) {
                return true;
            }
        }

        return false;
    }
}